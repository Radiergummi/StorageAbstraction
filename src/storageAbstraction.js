/**
 * StorageAbstraction class.
 * Serves as an abstraction layer for the different kinds of client 
 * local storage. Therefore, depending on the selected driver, a set
 * of methods is provided to store, manipulate and retrieve keys 
 * from the storage interface.
 * Currently available implementations are:
 *  - localStorage:   Browser-wide storage, persists after sessions
 *                    (= tabs and windows) are closed.
 *  - sessionStorage: Window- (or tab-) wide storage, only available
 *                    for the current session.
 *  - cookie:         Browser-wide storage, persists after sessions
 *                    are closed. Cookies are transmitted to the 
 *                    server though and can produce a lot of 
 *                    overhead when used excessively.
 *  - indexedDB:      Browser-wide, uber-fast storage, persists 
 *                    after sessions are closed. IndexedDB is ready
 *                    for the future, waiting only for Apple to 
 *                    support it.
 *
 * @param {string} driver  the storage driver to use
 *
 * @return void
 */
function StorageAbstraction (driver)
{
	// switch-case for the driver: fastest method to provide different
	// methods for different choices
	switch (driver) {
	
	// localStorage methods
	case 'localStorage':

		/**
		 * set function.
		 * sets a key in the localStorage container and JSONifies the
		 * keys value to store all data types.
		 *
		 * @param {string} key   the key to set
		 * @param {mixed} value  the value to set
		 * @return void
		 */
		this.set = function (key, value)
		{
			localStorage.setItem(
				key,
				JSON.stringify(value)
			)
		}


		/**
		 * remove function.
		 * removes a key from the localStorage container.
		 *
		 * @param {string} key  the key to remove
		 * @return void
		 */
		this.remove = function (key)
		{
			localStorage.removeItem(key)
		}


		/**
		 * dump function.
		 * retrieves all keys in the localStorage container.
		 *
		 * @return {object}  the object represention of the container
		 */
		this.dump = function ()
		{
			// interate over each key in the localStorage container and
			// parse the values JSON content.
			return Object.keys(localStorage).reduce(function(data, key) { 
				data[key] = JSON.parse(

					// get the current key
					localStorage.getItem(key)
				)
				
				// return the data object
				return data
			}, {})
		}


		/**
		 * clear function.
		 * clears the entire storage.
		 *
		 * @return void
		 */
		this.clear = function ()
		{
			localStorage.clear()
		}
		break

	case 'sessionStorage':

		/**
		 * set function.
		 * sets a key in the sessionStorage container and JSONifies the
		 * keys value to store all data types.
		 *
		 * @param {string} key   the key to set
		 * @param {mixed} value  the value to set
		 * @return void
		 */
		this.set = function (key, value)
		{
			window.sessionStorage.setItem(
				key,
				JSON.stringify(value)
			)
		}


		/**
		 * remove function.
		 * removes a key from the sessionStorage container.
		 *
		 * @param {string} key  the key to remove
		 * @return void
		 */
		this.remove = function (key)
		{
			window.sessionStorage.removeItem(key)
		}


		/**
		 * dump function.
		 * retrieves all keys in the localStorage container.
		 *
		 * @return {object}  the object represention of the container
		 */
		this.dump = function ()
		{
			// interate over each key in the sessionStorage container and
			// parse the values JSON content.
			return Object.keys(window.sessionStorage).reduce(function(data, key) { 
				data[key] = JSON.parse(

					// get the current key
					window.sessionStorage.getItem(key)
				) 

				// return the data object
				return data
			}, {})
		}


		/**
		 * clear function.
		 * clears the entire storage.
		 *
		 * @return void
		 */
		this.clear = function ()
		{
			window.sessionStorage.clear()
		}
		break

	case 'cookie':

		/**
		 * set function.
		 * sets a cookie and JSONifies the
		 * keys value to store all data types.
		 *
		 * @param {string} key   the key to set
		 * @param {mixed} value  the value to set
		 * @return void
		 */
		this.set = function (key, value)
		{
			document.cookie = key + '=' + JSON.stringify(value) + '; path=/'
		}


		/**
		 * remove function.
		 * removes a cookie from the jar.
		 *
		 * @param {string} key  the key to remove
		 * @return void
		 */
		this.remove = function (key)
		{
			// add exiration in the past (historic date in that regard)
			document.cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
		}


		/**
		 * dump function.
		 * retrieves all keys in the cookie storage.
		 *
		 * @return {object}  the object represention of the cookie storage
		 */
		this.dump = function ()
		{
			return document.cookie.split(';').reduce(function(data, cookie) {
				
				// if we have cookies, parse them
				if (cookie !== '') {
				
					// split key and value from the cookie string
					var cookieParts = cookie.split('=')
					data[cookieParts[0].trim()] = JSON.parse(cookieParts[1])
					
					// return the data object
					return data
				} else {
					
					// if not, return an empty object
					return {}
				}
			}, {})
		}


		/**
		 * clear function.
		 * clears the entire storage.
		 *
		 * @return void
		 */
		this.clear = function ()
		{
			var cookies = document.cookie.split(';');
			for (cookie in cookies) {
				document.cookie = /^[^=]+/.exec(cookies[cookie])[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
			}
		}
		break

	case 'indexedDB':
	
		return console.error('not implemented yet')
	
		this.initDatabase = function (onReady, key, value)
		{
			if ('indexedDB' in window) {
					var openRequest = indexedDB.open('storage', 1)
	 
					openRequest.onupgradeneeded = function(event) {
						var thisDB = event.target.result

						if (! thisDB.objectStoreNames.contains('storage')) {
							thisDB.createObjectStore('storage', {
								autoIncrement: false
							})
						}
					}

					openRequest.onsuccess = function(event) {

						// return the database handle
						onReady(event.target.result, key, value)
					}
	 
					openRequest.onerror = function(event) {
						console.error('IndexedDB could not be opened.')
						console.dir(event)
						return false
					}
			} else {
				console.error('IndexedDB is not supported in this browser.')
				return false
			}
		}

		/**
		 * set function.
		 * sets a key in the database.
		 *
		 * @param {string} key   the key to set
		 * @param {mixed} value  the value to set
		 * @return {bool}        whether the operation was successful or not
		 */
		this.set = function (key, value)
		{
			// initialize the database handle
			return this.initDatabase(function(database, key, value) {
			
				// check connection
				if (database === false) return false
				
				// create a store object
				var storage = database.transaction(['storage'], 'readwrite').objectStore('storage')
				console.log('key ' + key + ' set to ' + value)
				
				// set the key to the database
				var request = storage.put(value, key)
				
				console.log(request)
				
				// output debug info to the console
				request.onerror = function(event) {
					console.error('Could not store key ' + key + '.')
					console.dir(event.target.error.name)
					
					return false
				}
		 
				request.onsuccess = function(event) {
					return true
				}
			}, key, value)
		}
		
		
		this.get = function (key)
		{
			// initialize the database handle
			return this.initDatabase(function(database, key) {
			
				// check connection
				if (database === false) return false

				// create a store object
				var storage = database.transaction(['storage'], 'readonly').objectStore('storage')
				
				// set the key to the database
				var request = storage.get(key)

				// output debug info to the console
				request.onerror = function(event) {
					console.error('Could not delete key ' + key + '.')
					console.dir(event.target.error.name)

					return false
				}

				request.onsuccess = function(event) {
					StorageAbstraction.fetch(this.result)
				}
			}, key)
		}
		
		StorageAbstraction.fetch = function (data) {
			console.log(data)
		}


		/**
		 * remove function.
		 * removes a key from the database
		 *
		 * @param {string} key  the key to remove
		 * @return {bool}       whether the operation was successful or not
		 */
		this.remove = function (key)
		{
			// initialize the database handle
			return this.initDatabase(function(database, key) {
			
				// check connection
				if (database === false) return false

				// create a store object
				var storage = database.transaction(['storage'], 'readwrite').objectStore('storage')
				
				// set the key to the database
				var request = storage.delete(key)

				// output debug info to the console
				request.onerror = function(event) {
					console.error('Could not delete key ' + key + '.')
					console.dir(event.target.error.name)

					return false
				}
		 
				request.onsuccess = function(event) {
					return true
				}
			}, key)
		}


		/**
		 * dump function.
		 * retrieves all keys in the localStorage container.
		 *
		 * @return {object}  the object represention of the container
		 */
		this.dump = function ()
		{
			// initialize the database handle
			return this.initDatabase(function(database) {
			
				// check connection
				if (database === false) return false

				// create a store object
				var storage = null
				
				// set the key to the database
				var storage = database.transaction(['storage'], 'readonly').objectStore('storage')
				
				var request = storage.getAll() || {status: false}

				// output debug info to the console
				request.onerror = function(event) {
					console.error('Could not retrieve keys.')
					console.dir(event.target.error.name)

					return false
				}
		 
				request.onsuccess = function(event) {
					return event.target.result
				}
			})
		}


		/**
		 * clear function.
		 * clears the entire storage.
		 *
		 * @return {bool}  whether the operation was successful or not
		 */
		this.clear = function ()
		{
			// initialize the database handle
			this.initDatabase(function(database) {
				
				// check connection
				if (database === false) return false

				// create a store object
				var storage = database.transaction(['storage'], 'readwrite').objectStore('storage')
				
				// set the key to the database
				var request = storage.getAll()

				// output debug info to the console
				request.onerror = function(event) {
					console.error('Could not retrieve keys.')
					console.dir(event.target.error.name)
					
					return false
				}
		 
				request.onsuccess = function(event) {
					return true
				}
			})
		}
	break
}
