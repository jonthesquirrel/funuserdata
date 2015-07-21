//keylogger
var kl = {};

kl.dataTemplate = {
  log: [],
  freq: {},
  input: ''
};

kl.data = {};

kl.prefs = {
  sortFreq: {
    default: 'freq',
    options: ['freq', 'char'],
    names: {
      freq: 'by frequency',
      char: 'alphabetically'
    },
    isValid: function(val) {
      return kl.prefs.sortFreq.options.includes(val);
    },
    update: function() {
      kl.$sortFreq.innerHTML = kl.getPref('sortFreq', true);
      kl.updateDisplay();
    }
  }
};

kl.handleChange = function(event) {
  kl.data.input = kl.$input.value;
  kl.saveData();
};

kl.handleKeypress = function(event) {
  var char = String.fromCharCode(event.charCode);
  kl.process(char);
};

kl.handlePaste = function(event) {
  var text = event.clipboardData.getData('text');
  //solves UI freezing by deduplicating display updates
  var chars = text.split('');
  kl.data.log = kl.data.log.concat(chars);
  for (char of chars) {
    if (kl.data.freq[char]) {
      kl.data.freq[char]++;
    } else {
      kl.data.freq[char] = 1;
    }
  }
  kl.updateDisplay();
  kl.data.input = kl.$input.value;
  kl.saveData();
};

kl.process = function(char) {
  kl.data.log.push(char);
  if (kl.data.freq[char]) {
    kl.data.freq[char]++;
  } else {
    kl.data.freq[char] = 1;
  }
  kl.updateDisplay();
  kl.data.input = kl.$input.value;
  kl.saveData();
};

kl.updateAll = function() {
  kl.updateInput();
  kl.updateDisplay();
};

kl.updateInput = function() {
  kl.$input.value = kl.data.input;
};

kl.updateDisplay = function() {
  kl.$log.innerHTML = JSON.stringify(kl.data.log, null, ' ');
  kl.$freq.innerHTML = '';
  for (key of Object.keys(kl.data.freq).sort(function(aKey, bKey) {
    var aVal = kl.data.freq[aKey], bVal = kl.data.freq[bKey];
    if (aVal === bVal || (kl.getPref('sortFreq') === 'char')) { //pref override
      return aKey.charCodeAt() - bKey.charCodeAt(); //(unicode) char order
    } else {
      return bVal - aVal; //freq order
    }
  })) {
    var elm = document.createElement('li');
    var val = String(key);
    val = (val === ' ') ? 'space' : val; //replace space chars
    val = (val === '\n' || val === '\r') ? 'return' : val;
    elm.innerHTML = val + ': ' + String(kl.data.freq[key]);
    kl.$freq.appendChild(elm);
  }
};

kl.resetData = function() {
  kl.saveData(kl.dataTemplate);
  kl.loadData();
};

kl.getPref = function(key, displayName) { //get pref value or name
  var val = localStorage.getItem('kl_pref_' + key);
  if (displayName) {
    return kl.prefs[key].names[val];
  } else {
    return val;
  }
};

kl.setPref = function(key, val) {
  if (kl.prefs[key].isValid(val)) {
    localStorage.setItem('kl_pref_' + key, val);
    kl.prefs[key].update();
    return true;
  } else {
    return false;
  }
};

kl.loadData = function() {
  try { //make sure saved data is good
    var data = JSON.parse(localStorage.kl_data);
    for (key of Object.keys(kl.dataTemplate)) {
      kl.data[key] = data[key];
    }
    kl.updateAll();
  } catch (e) { //if not, reset it
    kl.resetData();
  }
};

kl.saveData = function(data) {
  if (data) { //manual save
    localStorage.kl_data = JSON.stringify(data);
  } else { //auto save
    localStorage.kl_data = JSON.stringify(kl.data);
  }
};

kl.init = function() {
  kl.$input = $id('input');
  kl.$log = $id('log');
  kl.$freq = $id('freq');
  kl.$sortFreq = $id('sortFreq');

  kl.loadData();

  for (key of Object.keys(kl.prefs)) {
    if (!kl.prefs[key].isValid(kl.getPref(key))) {
      kl.setPref(key, kl.prefs[key].default);
    }
    kl.prefs[key].update();
  }

  kl.$input.addEventListener('keypress', kl.handleKeypress);
  kl.$input.addEventListener('paste', kl.handlePaste);
  kl.$input.addEventListener('cut', kl.handleChange);
  kl.$input.addEventListener('keyup', kl.handleChange);
};

window.addEventListener('load', kl.init);
