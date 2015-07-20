var kl = {};

kl.log = [];
kl.stats = {};

kl.handler = function (e) {
  console.log(e);
  console.log(e.charCode);
  console.log(String.fromCharCode(e.charCode));
};

kl.init = function () {
  kl.$input = $id('input');
  kl.$log = $id('log');
  kl.$stats = $id('stats');

  kl.$input.addEventListener('keypress', kl.handler);
};

window.addEventListener('load', kl.init);
