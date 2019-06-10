/* license for this code at /license.txt */

/* global _, view */
/* exported regenerate */

var width = 1000;
var height = 1000;
var padding = 1;
var n_x = 20;
var n_y = 20;
var x = width / (n_x + 2 * padding);
view.viewSize = new Size(width, height);

var circle = new Path.Circle({
  center: view.center,
  radius: view.size.height / 3,
  strokeColor: 'black',
  strokeWidth: 1
});

var border = new Path.Rectangle({
  x: 0,
  y: 0,
  width: width,
  height: height,
  strokeColor: 'black',
  strokeWidth: 1
});

_.map(_.range(n_y), function (j) {
  _.map(_.range(n_x), function (i) {
    var path = new Path.Rectangle({
      x: x + i * x,
      y: x + j * x,
      width: x - 5,
      height: x - 5,
      strokeColor: 'black',
      strokeWidth: 1
    });
  });
});

function onResize(event) {
  view.viewSize = new Size(width, height);
  console.log(window.innerHeight);
}
