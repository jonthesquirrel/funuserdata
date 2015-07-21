//keylogger
var kl = {};

kl.log = [];
kl.freq = {};

kl.prefs = {
  sortFreq: {
    default: 'freq',
    options: ['freq', 'char'],
    isValid: function(val) {
      return kl.prefs.sortFreq.options.includes(val);
    },
    update: function() {
      kl.$sortFreq.innerHTML = kl.getPref('sortFreq');
      kl.display();
    }
  }
};

kl.handler = function(event) {
  var char = String.fromCharCode(event.charCode);
  kl.update(char);
};

kl.update = function(char) {
  kl.log.push(char);
  if (kl.freq[char]) {
    kl.freq[char]++;
  } else {
    kl.freq[char] = 1;
  }
  kl.display();
};

kl.display = function() {
  kl.clear();
  kl.$log.innerHTML = JSON.stringify(kl.log, 1);
  for (key of Object.keys(kl.freq).sort(function(aKey, bKey) {
    var aVal = kl.freq[aKey], bVal = kl.freq[bKey];
    if (aVal === bVal || (kl.getPref('sortFreq') === 'char')) { //pref override
      return aKey.charCodeAt() - bKey.charCodeAt(); //unicode order
    } else {
      return bVal - aVal; //freq order
    }
  })) {
    var elm = document.createElement('li');
    var val = String(key);
    val = (val === ' ') ? 'space' : val; //replace space char with "space"
    elm.innerHTML = val + ': ' + String(kl.freq[key]);
    kl.$freq.appendChild(elm);
  }
};

kl.clear = function() {
  kl.$log.innerHTML = '[]';
  kl.$freq.innerHTML = '';
};

kl.reset = function() {
  kl.log = [];
  kl.freq = {};
  kl.clear();
};

kl.getPref = function(key) {
  return localStorage.getItem('KL' + key);
};

kl.setPref = function(key, val) {
  if (kl.prefs[key].isValid(val)) {
    localStorage.setItem('KL' + key, val);
    kl.prefs[key].update();
    return true;
  } else {
    return false;
  }
};

kl.init = function() {
  kl.$input = $id('input');
  kl.$log = $id('log');
  kl.$freq = $id('freq');
  kl.$sortFreq = $id('sortFreq');

  for (key of Object.keys(kl.prefs)) {
    if (!kl.prefs[key].isValid(kl.getPref(key))) {
      kl.setPref(key, kl.prefs[key].default);
    }
    kl.prefs[key].update();
  }

  kl.$input.addEventListener('keypress', kl.handler);
};

window.addEventListener('load', kl.init);
