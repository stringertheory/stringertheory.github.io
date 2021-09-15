/* license for this code at /license.txt */

function drawOne(s, x, y) {
  var n_lines = 15;
  _.each(_.range(n_lines - 0), function(i) {
    var color = chroma.random().hex();
    var rscale = 1;
    var line = s.line(x + (i + rscale * Math.random()) / n_lines, y, x + 1, y + (i + rscale * Math.random()) / n_lines).attr({
      stroke: color,
      strokeWidth: .01
    });
    var line = s.line(x + 1, y + (i + rscale * Math.random()) / n_lines, x + 1 - (i + rscale * Math.random()) / n_lines, y + 1).attr({
      stroke: color,
      strokeWidth: .01
    });
    var line = s.line(x + 1 - (i + rscale * Math.random()) / n_lines, y + 1, x, y + 1 - (i + rscale * Math.random()) / n_lines).attr({
      stroke: color,
      strokeWidth: .01
    });
    var line = s.line(x, y + 1 - (i + rscale * Math.random()) / n_lines, x + (i + rscale * Math.random()) / n_lines, y).attr({
      stroke: color,
      strokeWidth: .01
    });
  });
}

function regenerate() {
  var SVG_ID = "#canvas";
  var N_X = 7;
  var N_Y = 7;
  var STROKE_WIDTH = .01;
  var BACKGROUND_COLOR = Snap.rgb(255, 225, 195, .1);
  var BORDER = .5;
  var s = makeSVG(N_X, N_Y, BORDER);
  s.rect(-BORDER, -BORDER, N_X + 2 * BORDER, N_Y + 2 * BORDER).attr({
    stroke: "none",
    fill: BACKGROUND_COLOR
  });
  _.each(_.range(N_X), function(x) {
    _.each(_.range(N_Y), function(y) {
      drawOne(s, x, y);
    });
  });
}
