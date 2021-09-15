/* license for this code at /license.txt */

function regenerate() {
  var N_X = 50;
  var N_Y = 50;
  var N_ELLIPSES = N_X * 2;
  var s = makeSVG(N_X, N_Y);
  var angle = 0;
  _.each(_.range(N_ELLIPSES), function(i) {
    var x = N_X / 2 - .5;
    var y = N_Y / 2;
    var rx = i / 2.2 + jitter(.1);
    var ry = i / 2 + jitter(.1);
    angle += jitter(2);
    var e = s.ellipse(x, y, rx, ry).attr({
      stroke: "blue",
      fill: "none",
      strokeWidth: .1,
      strokeOpacity: 1
    });
    e.transform(Snap.format("r{angle},{x_center},{y_center}", {
      angle: angle,
      x_center: x,
      y_center: y
    }));
  });
  _.each(_.range(N_ELLIPSES), function(i) {
    var x = N_X / 2 + .5 + jitter(.1);
    var y = N_Y / 2 + jitter(.1);
    var rx = i / 2 + jitter(.05);
    var ry = i / 2.2 + jitter(.05);
    angle += jitter(2);
    var e = s.ellipse(x, y, rx, ry).attr({
      stroke: "red",
      fill: "none",
      strokeWidth: .1,
      strokeOpacity: 1
    });
    e.transform(Snap.format("r{angle},{x_center},{y_center}", {
      angle: angle,
      x_center: x,
      y_center: y
    }));
  });
}
