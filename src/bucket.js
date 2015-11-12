/**
 * Bucket class.
 * Provides a simple abstraction for client-side storage.
 * 
 * @param {object} options         options to use
 * @param {string} options.driver  the storage API to use. defaults to localStorage
 */
function Bucket (options)
{
	// default options
	var defaults = {
		/**
		 * the storage driver to use for storing data permanently.
		 *
		 * possible values:
		 *  - localStorage    data is available across instances
		 *  - sessionStorage  data is only available in this window
		 *  - cookie          data is available across instances, but cookie
		 *  - indexedDB       data is available across instances, but complex
		 */
		driver: 'localStorage'
	}

	// merge the given options with our defaults
	options = $.extend(defaults, options)


	/**
	 * the session storage
	 * Session data will be saved here.
	 *
	 * @var {object}
	 */ 
	this.storage = {}


	/**
	 * storage driver
	 * the driver to store the session data permanently in
	 *
	 * @var {string}
	 */
	this.driver = ''


	/**
	 * Constructor function.
	 * Emulates a constructor by collecting all construction time code.
	 */
	this.construct = function ()
	{
		// set the driver to use
		this.driver = options.driver

		// initialize our storage driver
		this.storageFactory = new StorageAbstraction(this.driver)

		// restore all keys from the permanent storage
		this.storage = this.storageFactory.dump() || {}
	}


	/**
	 * get function.
	 * retrieves a key from our session storage
	 *
	 * @param {string} key      the key to find
	 * @param {mixed} fallback  a fallback value in case the key cannot be found
	 *
	 * @return {mixed}          the content of our key
	 */
	this.get = function (key, fallback)
	{
		// if we found our key, return it
		if (key in this.storage) {
			return this.storage[key]
		}

		// if we don't know the key but have a fallback, return that instead
		if (typeof fallback !== 'undefined') {
			return fallback
		}
	}


	/**
	 * set function.
	 * sets a key in the session storage
	 *
	 * @param {string} key   the key to set
	 * @param {mixed} value  the value to set
	 *
	 * @return void
	 */
	this.set = function (key, value)
	{
		// set the key and its value
		this.storage[key] = value

		// trigger the drivers set function
		this.storageFactory.set(key, value)
	}
  
  
	/**
	 * remove function.
	 * removes a key from the session storage
	 *
	 * @param {string} key  the key to set
	 * 
	 * @return void
	 */
	this.remove = function (key)
	{
		// delete the key
		delete this.storage.key

		// trigger the drivers remove function
		this.storageFactory.remove(key)
	}


	/**
	 * has function.
	 * checks if a key exists in the storage.
	 *
	 * @param {string} key  the key to check for
	 *
	 * @return {bool}       whether the key exists or not
	 */
	this.has = function (key)
	{
		// check for presence
		return (key in this.storage)
	}


	/**
	 * clear function.
	 * clears the entire storage.
	 * 
	 * @return void
	 */
	this.clear = function ()
	{
		// set the live storage to an empty object
		this.storage = {}
		
		// trigger the drivers clear function
		this.storageFactory.clear()
	}


	/**
	 * dump function.
	 * returns the complete storage object.
	 *
	 * @return {object}  the storage object.
	 */
	this.dump = function ()
	{
		// return the complete storage
		return this.storage
	}


	/**
	 * getAll function.
	 * Alias function for dump.
	 *
	 * @return {object}  the storage object.
	 */
	this.getAll = function ()
	{
		return this.dump()
	}


	// execution
	this.construct()
}
