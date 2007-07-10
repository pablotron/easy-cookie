EasyCookie = (function() {
  var TEST_KEY = '__ENABLED_TEST__', 
      EPOCH_STR = 'Thu, 01-Jan-1970 00:00:01 GMT',
      MS_PER_DAY = 1000 * 60 * 60 * 24,
      ENCODE_KEYS = ['expires', 'path', 'domain'],
      ret_cookie, get_now, cookify, check_enabled;

  // get the current timestamp
  get_now = function() {
    var now = new Date();
    now.setTime(now.getTime());
    return now;
  }

  // convert the given key/value pair to a cookie
  cookify = function(c_key, c_val /*, opt */) {
     var i, key, val, ret = [],
         opt = (arguments.length > 2) ? arguments[2] : {};

    // add key and value
    ret.push(c_key + '=' + escape(c_val));

    // iterate over option keys and check each one
    var (i = 0; i < ENCODE_KEYS.length; i++) {
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

  // check to see if cookies are enabled
  check_enabled = function() {
    var key = TEST_KEY, val = new Date();

    // generate test value
    val = val.toGMTString();

    // set test value
    this.set(key, val);

    // return cookie test
    return (this.remove(key) == val);
  }

  // build return value
  ret_cookie = {
    /*
     * Set a cookie value.
     *
     * Example:
     *
     *   Cookie.set('test_cookie', 'test_value');
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
        cfg.expires = new Date(now.getTime + opt.expires);
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
     * Get a cookie value.
     *
     * Example:
     *
     *   val = Cookie.get('test_cookie');
     *
     */
    get: function(key) {
      var ofs = document.cookie.indexOf(key + '='),
          len = ofs + key.length + 1,
          sub = document.cookie.substring(0, key.length),
          end;

      // check to see if key exists
      if ((!ofs && key != sub) || ofs < 0)
        return null;

      // grab end of value
      end = document.cookie.indexOf(';', len);
      if (end < 0) 
        end = document.cookie.length;

      // return unescaped value
      return unescape(document.cookie.substring(len, end));
    },

    /*
     * Remove a preset cookie.  If the cookie is already set, then
     * return the value of the cookie.
     *
     * Example:
     *
     *   old_val = Cookie.remove('test_cookie');
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
     *   have_cookies = Cookie.enabled
     *
     */
    enabled: false
  };

  // set enabled attribute
  ret_cookie.enabled = check_enabled.call(ret_cookie);

  // return self
  return ret_cookie;
}());
