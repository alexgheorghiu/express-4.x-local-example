//Contine baza de date
var records = [
    { id: 1, username: 'ion', password: 'ion', displayName: 'Ion', emails: [ { value: 'ion@exemplu.com' } ] }
  , { id: 2, username: 'maria', password: 'maria', displayName: 'Maria', emails: [ { value: 'maria@exemplu.com' } ] }
];


/**
 * Gaseste un utilizator in "baza de date" pe baza id-ului
 * @param id - Id-ul user-ului
 * @param cb - Functia de callback
*/
exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    }
  });
}


/**
 * Gaseste un utilizator in "baza de date" pe baza numelui
 * @param username - Numele de utilizator al user-ului
 * @param cb - Functia de callback
*/
exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
