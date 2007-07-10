
Test = {
  set: function() {
    var e = document.getElementById('test'), 
        val = e.value;
    EasyCookie.set('test_key', val);
    e.value = val ? 'set: ' + val : '';
  },

  get: function() {
    var val = EasyCookie.get('test_key'),
        e = document.getElementById('test');
    e.value = val ? val : '';
  },

  rm: function() {
    var val = EasyCookie.remove('test_key'),
        e = document.getElementById('test');
    e.value = val ? 'removed: ' + val : '';
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
