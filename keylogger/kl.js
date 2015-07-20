var kl = {};

kl.log = [];
kl.stats = {};

kl.handler = function(event) {
  var char = String.fromCharCode(event.charCode);
  kl.update(char);
};

kl.update = function(char) {
  kl.log.push(char);

  if (kl.stats[char]) {
    kl.stats[char]++;
  } else {
    kl.stats[char] = 1;
  }

  kl.$log.innerHTML = JSON.stringify(kl.log);
  kl.$stats.innerHTML = JSON.stringify(kl.stats);
};

kl.init = function() {
  kl.$input = $id('input');
  kl.$log = $id('log');
  kl.$stats = $id('stats');

  kl.$input.addEventListener('keypress', kl.handler);
};

window.addEventListener('load', kl.init);
