import idb from 'idb';

const dbPromise = idb.open('currencies', 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('currencies');
      break;
    default:
      console.error('IndexedDB database could not be created.');
      break;
  }
});

export default class Database {
  static getCurrencies(key) {
    return dbPromise
      .then(db => {
        if (!db) return;
        const transaction = db.transaction('currencies');
        const store = transaction.objectStore('currencies');

        const data = store.get(key);
        return data;
      })
      .catch(err => {
        console.error('error getting data from db', err);
      });
  }

  static saveCurrencies(key, currencies) {
    return dbPromise
      .then(db => {
        const transaction = db.transaction('currencies', 'readwrite');
        const store = transaction.objectStore('currencies');

        currencies.forEach(currency => store.put(currency, key));
      })
      .catch(err => {
        console.error('error saving data to db', err);
      });
  }
}