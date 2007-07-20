
Test = {
  out: function(str) {
    var div = document.getElementById('output');
    div.innerHTML = str;
  },

  keyval: function() {
    var key_e = document.getElementById('name'), 
        key = key_e.value,
        val_e = document.getElementById('test'), 
        val = val_e.value;

    return [key, val];
  },

  set: function() {
    var kv = Test.keyval();

    EasyCookie.set(kv[0], kv[1]);

    Test.out(kv[1] ? 'set: ' + kv.join('=') : '');
  },

  get: function() {
    var kv = Test.keyval(),
        val = EasyCookie.get(kv[0]),
        e = document.getElementById('test');

    e.value = val ? val : '';

    Test.out(val ? 'got: ' + kv.join('=') : '');
  },

  rm: function() {
    var kv = Test.keyval(),
        r = EasyCookie.remove(kv[0]);

    Test.out(r ? 'removed: ' + kv.join('=') : '');
  },

  keys: function() {
    var i, out, ret = [];

    // get all cookies
    keys = EasyCookie.keys();

    // update output element
    for (i = 0; i < keys.length; i++)
      ret.push('<li>' + keys[i] + '</li>');

    // display output
    Test.out('All Keys:<ul>' + ret.join('') + '</ul>');
  },

  all: function() {
    var i, c, out, ret = [];

    // get all cookies
    all = EasyCookie.all();

    // update output element
    for (i = 0; i < all.length; i++) {
      c = all[i];
      ret.push('<tr><td>' + c[0] + '</td><td>' + c[1] + '</td></tr>');
    }

    // display output
    Test.out('All Key/Value Pairs:<table>' + ret.join('') + '</table>');
  },

  init: function() {
    var e = document.getElementById('cfg');
    if (EasyCookie.enabled)
      return;
    e.innerHTML = 'Cookies are disabled.  Please enable them to continue.';
  }
};

// init test
window.onload = Test.init;
