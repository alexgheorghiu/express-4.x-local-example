var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');


// [En] Configure the local strategy for use by Passport.
// The local strategy require a `verify` function which receives the credentials
// (`username` and `password`) submitted by the user.  The function must verify
// that the password is correct and then invoke `cb` with a user object, which
// will be set at `req.user` in route handlers after authentication.

// [Ro] Configureaza stategia locala pentru a fi folosita de catre Passport
// Strategia locala cere ca sa existe o functie `verify` care sa primeasca credentialele
// (`username` and `password`) introduse de utilizator. Functia trebuie sa verifice
// ca parola este corecta si apoi sa invoce `cb` cu un obiect user care
// va fi stocat ca si `req.user` in manager-ul de cai, dupa autentificare
passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { 
        return cb(err); 
      }
      if (!user) { 
        return cb(null, false); 
      }
      if (user.password != password) { 
        return cb(null, false); 
      }

      return cb(null, user);
    });
  }));



//[En] Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.

//[Ro] Configureaza tot ce tine de persistenta sesiunii folosita de Passport
//
// Pentru a reface starea autentificarii in cererile HTTP, Passport are nevoie
// sa serializeze utilizatorii in si sa deserializeze utilizatorii din sesiune. 
// Implementarea tipica o reprezinta doar furnizarea ID-ului unui utilizator cind
// se serializeaza, si interogarea pe baza acelui ID pentru a gasi inregistrarea in baza de date
// la momentul deserializarii.


/**
 * Setarea serializarii in Passport
 * @param user - Utilizatorul ce trebuie serializat
 * @param cb - Callback-ul apelat
 */
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});


/**
 * Setarea deserializarii in Passport
 * @param user - ID-ul utilizatorul ce trebuie deserializat
 * @param cb - Callback-ul apelat
 */
passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


// [EN]Create a new Express application.
// [RO] Creeare unei aplicatii Express
var app = express();

// [EN] Configure view engine to render EJS templates.
// [RO] Configurarea engine-ului de vizualizare a sabloanelor EJS 
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// [EN] Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
// [RO] Setare de middleware-uri pentru jurnalizare, parsare
// si management al sesiunii
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// [EN] Initialize Passport and restore authentication state, if any, from the
// session.
// [RO] Initializare Passport si restaurarea starii de autentificare, daca exista, din
// sesiune
app.use(passport.initialize());
app.use(passport.session());

// [EN] Define routes.
// [RO] Definitie rute
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
  });

app.get('/login',
  function(req, res){
    res.render('login');
  });
  
app.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });
  
app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.render('profile', { user: req.user });
  });

app.listen(3000);
