/* license for this code at /license.txt */

function regenerate() {
  var N_X = 12;
  var N_Y = 24;
  var STROKE_WIDTH = .05;
  var s = makeSVG(N_X, N_Y, 1);
  _.each(_.range(N_X), function(x) {
    _.each(_.range(N_Y), function(y) {
      var r = s.rect(x, y, 1, 1).attr({
        stroke: "black",
        strokeWidth: STROKE_WIDTH,
        fill: "none"
      });
      r.transform(Snap.format("r{angle},{x_center},{y_center}", {
        angle: y / N_Y * 90 * (Math.random() - .5),
        x_center: x,
        y_center: y
      }));
    });
  });
}
