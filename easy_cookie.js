/*
 * EasyCookie - an easy Javascript cookie handling interface.
 *
 * License
 * =======
 * Copyright (C) 2007 Paul Duncan <pabs@pablotron.org>
 * 
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 * 
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 *   * The names of contributors may not be used to endorse or promote
 *     products derived from this software without specific prior written
 *     permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER
 * OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 * LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * Usaging EasyCookie
 * ==================
 * Get a cookie:
 * 
 *   val = EasyCookie.get('some_key');
 * 
 * Set a cookie:
 * 
 *   val = 'this is a test string';
 *   EasyCookie.get('some_key', val);
 * 
 * Remove a cookie:
 * 
 *   old_val = EasyCookie.remove('some_key');
 * 
 * Check to see if cookies are enabled:
 * 
 *   status = EasyCookie.enabled ? 'enabled' : 'not enabled';
 *   alert('Cookies are ' + status);
 * 
 * Set also has several optional parameters, which can be passed like so:
 * 
 *   val = 'this is a test string';
 *   EasyCookie.set('some_key', val, {
 *     // expires in 10 days
 *     expires: 10,
 * 
 *     // limit cookie to domain 'foo.example.com'
 *     domain: 'foo.example.com',
 * 
 *     // limit cookie to path '/some/path'
 *     path: '/some/path',
 * 
 *     // restrict cookie to secure pages only
 *     secure: true
 *   });
 * 
 * You can also get a list of existing cookies like so:
 * 
 *   // get an array of cookie names
 *   keys = EasyCookie.keys();
 * 
 * See test/test.js for examples of all methods.
 *
 */
EasyCookie = (function() {
  var EPOCH = 'Thu, 01-Jan-1970 00:00:01 GMT',
      // milliseconds per day
      RATIO = 1000 * 60 * 60 * 24,
      // keys to encode 
      KEYS = ['expires', 'path', 'domain'],
      // wrappers for common globals
      esc = escape, un = unescape, doc = document,
      me; 

  // private methods

  /*
   * Get the current time.
   *
   * This method is private.
   */
  var get_now = function() {
    var r = new Date();
    r.setTime(r.getTime());
    return r;
  }

  /*
   * Convert the given key/value pair to a cookie.
   *
   * This method is private.
   */
  var cookify = function(c_key, c_val /*, opt */) {
     var i, key, val, r = [],
         opt = (arguments.length > 2) ? arguments[2] : {};

    // add key and value
    r.push(esc(c_key) + '=' + esc(c_val));

    // iterate over option keys and check each one
    for (i = 0; i < KEYS.length; i++) {
      key = KEYS[i];
      if (val = opt[key])
        r.push(key + '=' + val);
    }

    // append secure (if specified)
    if (opt.secure)
      r.push('secure');

    // build and return result string
    return r.join('; ');
  }

  /*
   * Check to see if cookies are enabled.
   *
   * This method is private.
   */
  var alive = function() {
    var k = '__EC_TEST__', 
        v = new Date();

    // generate test value
    v = v.toGMTString();

    // set test value
    this.set(k, v);

    // return cookie test
    this.enabled = (this.remove(k) == v);
    return this.enabled;
  }

  // public methods

  // build return object
  me = {
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
        opt.expires *= RATIO;

        // set cookie expiration date
        cfg.expires = new Date(now.getTime() + opt.expires);
        cfg.expires = cfg.expires.toGMTString();
      }

      // set remaining keys
      var keys = ['path', 'domain', 'secure'];
      for (i = 0; i < keys.length; i++)
        if (opt[keys[i]])
          cfg[keys[i]] = opt[keys[i]];

      var r = cookify(key, val, cfg);
      doc.cookie = r;

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
      key = esc(key);

      var c = doc.cookie,
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
      key = esc(key);

      var c = doc.cookie, 
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
      return un(c.substring(len, end));
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
    remove: function(k) {
      var r = me.get(k), 
          opt = { expires: EPOCH };

      // delete cookie
      doc.cookie = cookify(k, '', opt);

      // return value
      return r;
    },

    /*
     * Get a list of cookie names.
     *
     * Example:
     *
     *   // get all cookie names
     *   cookie_keys = EasyCookie.keys();
     *
     */
    keys: function() {
      var c = doc.cookie, 
          ps = c.split('; '),
          i, p, r = [];

      // iterate over each key=val pair and grab the key
      for (i = 0; i < ps.length; i++) {
        p = ps[i].split('=');
        r.push(un(p[0]));
      }

      // return results
      return r;
    },
  
    /*
     * Get an array of all cookie key/value pairs.
     *
     * Example:
     *
     *   // get all cookies
     *   all_cookies = EasyCookie.all();
     *
     */
    all: function() {
      var c = doc.cookie, 
          ps = c.split('; '),
          i, p, r = [];

      // iterate over each key=val pair and grab the key
      for (i = 0; i < ps.length; i++) {
        p = ps[i].split('=');
        r.push([un(p[0]), un(p[1])]);
      }

      // return results
      return r;
    },

    /* 
     * Version of EasyCookie
     */
    version: '0.2.1',

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
  me.enabled = alive.call(me);

  // return self
  return me;
}());

