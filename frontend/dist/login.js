var c = document.getElementById('canv');
var b = document.getElementsByTagName('body')[0];
var $ = c.getContext('2d');
var col = function(x, y, r, g, b) {
  $.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
  $.fillRect(x, y, 1, 1);
}
var R = function(x, y, t) {
  return (Math.floor(80 + 64 * Math.cos((x * x - y * y) / 300 + t)));
}
var G = function(x, y, t) {
  return (Math.floor(80 + 64 * Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)));
}
var B = function(x, y, t) {
  return (Math.floor(80 + 64 * Math.sin(5 * Math.sin(t / 9) + ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100)));
}
var t = 0;
var run = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  c.style.width = w + 'px';
  c.style.height = h + 'px';
  $.canvas.width  = (w/25);
  $.canvas.height = (h/25);
  for (x = 0; x <= (w/25) + 5; x++) {
    for (y = 0; y <= (h/25) + 5; y++) {
      col(x, y, R(x, y, t), G(x, y, t), B(x, y, t));
    }
  }
  t = t + 0.030;
  window.requestAnimationFrame(run);
};
run();

document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });
