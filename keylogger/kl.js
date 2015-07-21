//keylogger
var kl = {};

kl.log = [];
kl.freq = {};

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
  for (key of Object.keys(kl.freq).sort(function(a, b) {
    return kl.freq[a] - kl.freq[b];
  })) {
    var elm = document.createElement('li');
    elm.innerHTML = String(key) + ': ' + String(kl.freq[key]);
    kl.$freq.appendChild(elm);
  }
};

kl.clear = function() {
  kl.$log.innerHTML = '';
  kl.$freq.innerHTML = '';
};

kl.reset = function() {
  kl.log = [];
  kl.freq = {};
  kl.clear();
};

kl.init = function() {
  kl.$input = $id('input');
  kl.$log = $id('log');
  kl.$freq = $id('freq');

  kl.$input.addEventListener('keypress', kl.handler);
};

window.addEventListener('load', kl.init);
