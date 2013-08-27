// color_test.js

$( function() {

var canvas = document.getElementById('canvas'),
  WIDTH = canvas.width,
  HEIGHT = canvas.height,
  ctx = canvas.getContext('2d');

(function testCanvas() {
  ctx.fillStyle = Color.rgb(0,0,0);
  ctx.fillRect(0,0,WIDTH,HEIGHT);
})();

(function testLinearGradient() {
  var width = 1,
      gradientFn = Color.linear([[0,0,0],[255,255,255],[255,0,0]]);

  for(var i = 0; i < WIDTH; i += width) {
    ctx.fillStyle = gradientFn(i/WIDTH);
    ctx.fillRect(i,0,width,HEIGHT);
  }
})();

});