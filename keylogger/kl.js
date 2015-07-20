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

  kl.$log.innerHTML = JSON.stringify(kl.log, 1);
  kl.$freq.innerHTML = JSON.stringify(kl.freq, 1);
};

kl.reset = function() {
  kl.log = [];
  kl.freq = {};

  kl.$log.innerHTML = '';
  kl.$freq.innerHTML = '';
};

kl.init = function() {
  kl.$input = $id('input');
  kl.$log = $id('log');
  kl.$freq = $id('freq');

  kl.$input.addEventListener('keypress', kl.handler);
};

window.addEventListener('load', kl.init);
