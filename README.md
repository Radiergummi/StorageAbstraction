# StorageBucket
A simple abstraction layer for client-side storage in JS.  

StorageBucket provides simple, unified methods like `get(key)`, `set(key, value)` or `delete(key)` to store data stored permanently on the client using native APIs. This saves you from implementing different APIs for different clients or (de-)serializing values.  
To keep things fast, StorageBucket reads the data upon intialization and only writes changes back to the storage. Reading happens from an object mirroring the data structure.
Currently, StorageBucket supports `localStorage`, `sessionStorage` and `cookie`. IndexedDB is in progress. 

## Methods

### `get(key)`
retrieves data from the storage.

### `set(key, value)`
writes data to the storage

### `delete(key)`
removes data from the storage

### `has(key)`
checks if a key exists

### `clear()`
purges the storage

### `dump()` or `getAll()`
returns the complete stored data object

## Usage

First, create a storage object:

    var dataStore = new Bucket({driver: 'localStorage'})
    
Feed it some data:

    dataStore.set('foo', 'bar')
    dataStore.set('baz', [{test: 'abc'}, 1, 2, "foobar", 6])
    
Check them:

    dataStore.get('foo') // bar

Reload your browser, check again:

    var dataStoreNew = new Bucket({driver: 'localStorage'})
    dataStoreNew.get('foo') // bar
