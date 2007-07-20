EasyCookie = (function() {
  var TEST_KEY = '__ENABLED_TEST__', 
      EPOCH_STR = 'Thu, 01-Jan-1970 00:00:01 GMT',
      MS_PER_DAY = 1000 * 60 * 60 * 24,
      ENCODE_KEYS = ['expires', 'path', 'domain'],
      ret_cookie, get_now, cookify, check_enabled;

  // private methods

  /*
   * Get the current time.
   *
   * This method is private.
   */
  get_now = function() {
    var now = new Date();
    now.setTime(now.getTime());
    return now;
  }

  /*
   * Convert the given key/value pair to a cookie.
   *
   * This method is private.
   */
  cookify = function(c_key, c_val /*, opt */) {
     var i, key, val, ret = [],
         opt = (arguments.length > 2) ? arguments[2] : {};

    // add key and value
    ret.push(c_key + '=' + escape(c_val));

    // iterate over option keys and check each one
    for (i = 0; i < ENCODE_KEYS.length; i++) {
      key = ENCODE_KEYS[i];
      if (val = opt[key])
        ret.push(key + '=' + val);
    }

    // append secure (if specified)
    if (opt.secure)
      ret.push('secure');

    // build and return result string
    return ret.join('; ');
  }

  /*
   * Check to see if cookies are enabled.
   *
   * This method is private.
   */
  check_enabled = function() {
    var key = TEST_KEY, val = new Date();

    // generate test value
    val = val.toGMTString();

    // set test value
    this.set(key, val);

    // return cookie test
    this.enabled = (this.remove(key) == val);
    return this.enabled;
  }

  // public methods

  // build return object
  ret_cookie = {
    /*
     * Set a cookie value.
     *
     * Examples:
     *
     *   // simplest-case
     *   EasyCookie.set('test_cookie', 'test_value');
     *
     *   // more complex example
     *   EasyCookie.set('test_cookie', 'test_value', {
     *     // expires in 13 days
     *     expires: 13,
     *
     *     // restrict to given domain
     *     domain: 'foo.example.com',
     *
     *     // restrict to given path
     *     path: '/some/path',
     *
     *     // secure cookie only
     *     secure: true
     *   });
     *
     */
    set: function(key, val /*, opt */) {
      var opt = (arguments.length > 2) ? arguments[2] : {}, 
          now = get_now(),
          expire_at,
          cfg = {};

      // if expires is set, convert it from days to milliseconds
      if (opt.expires) {
        opt.expires *= MS_PER_DAY;

        // set cookie expiration date
        cfg.expires = new Date(now.getTime() + opt.expires);
        cfg.expires = cfg.expires.toGMTString();
      }

      // set remaining keys
      var keys = ['path', 'domain', 'secure'];
      for (i = 0; i < keys.length; i++)
        if (opt[keys[i]])
          cfg[keys[i]] = opt[keys[i]];

      ret = cookify(key, val, cfg);
      document.cookie = ret;

      return val;
    },

    /*
     * Check to see if the given cookie exists.
     *
     * Example:
     *
     *   val = EasyCookie.get('test_cookie');
     *
     */
    has: function(key) {
      var c = document.cookie,
          ofs = c.indexOf(key + '='),
          len = ofs + key.length + 1,
          sub = c.substring(0, key.length);

      // check to see if key exists
      return ((!ofs && key != sub) || ofs < 0) ? false : true;
    },

    /*
     * Get a cookie value.
     *
     * Example:
     *
     *   val = EasyCookie.get('test_cookie');
     *
     */
    get: function(key) {
      var c = document.cookie, 
          ofs = c.indexOf(key + '='),
          len = ofs + key.length + 1,
          sub = c.substring(0, key.length),
          end;

      // check to see if key exists
      if ((!ofs && key != sub) || ofs < 0)
        return null;

      // grab end of value
      end = c.indexOf(';', len);
      if (end < 0) 
        end = c.length;

      // return unescaped value
      return unescape(c.substring(len, end));
    },

    /*
     * Remove a preset cookie.  If the cookie is already set, then
     * return the value of the cookie.
     *
     * Example:
     *
     *   old_val = EasyCookie.remove('test_cookie');
     *
     */
    remove: function(key) {
      var ret = ret_cookie.get(key), 
          opt = { expires: EPOCH_STR };

      // delete cookie
      document.cookie = cookify(key, '', opt);

      // return value
      return ret;
    },

    /*
     * Are cookies enabled?
     *
     * Example:
     *
     *   have_cookies = EasyCookie.enabled
     *
     */
    enabled: false
  };

  // set enabled attribute
  ret_cookie.enabled = check_enabled.call(ret_cookie);

  // return self
  return ret_cookie;
}());
