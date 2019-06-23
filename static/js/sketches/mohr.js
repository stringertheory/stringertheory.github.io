/* license for this code at /license.txt */

/* global _, Snap, makeSVG, make_parameters, format_int, format_decimal */
/* exported regenerate */

var parameters = make_parameters('parameters', [
  {
    name: 'n_x',
    start: [8],
    range: {'min': 1, 'max': 42},
    format: format_int()
  }, {
    name: 'n_y',
    start: [8],
    range: {'min': 1, 'max': 42},
    format: format_int()
  }, {
    name: 'stroke_width',
    start: [0.02],
    range: {
      'min': 0.002,
      '50%': 0.02,
      'max': 0.2
    },
    format: format_decimal()
  }, {
    name: 'padding',
    start: [0.2],
    range: {'min': 0, 'max': 0.35},
    format: format_decimal(),
    metric_name: 'stroke_width_2',
  }, {
    name: 'tightness',
    start: [0.15],
    range: {'min': 0.02, '50%': 0.1, 'max': 0.3},
    format: format_decimal(),
    metric_name: 'grid_jitter'
  }
]);


function regenerate () {

  var BORDER = 1;
  var N_X = parameters['n_x'].slider.get();
  var N_Y = parameters['n_y'].slider.get();
  var STROKE_WIDTH = parameters['stroke_width'].slider.get();
  var PAD = new Number(parameters['padding'].slider.get());
  var R = new Number(parameters['tightness'].slider.get());
  var BACK = 25;
  var FORE = 230;
  var OPACITY = 0.9;

  var ANGLES = {};
  ANGLES[0] = [0, 45, -45, 90, 90, 90, -90, -90, -90, 135, -135];
  ANGLES[45] = [0, 45, 45, -45, -45, -45, -45, 90, -90, 135, -135];
  ANGLES[-45] = [0, -45, -45, 45, 45, 45, 45, -90, 90, -135, 135];
  ANGLES[90] = [0, 0, 0, 45, -45, 90, -90, 135, -135];
  ANGLES[-90] = [0, 0, 0, -45, 45, -90, 90, -135, 135];
  ANGLES[135] = [0, 45, 45, 45, -45, -45, -45, 90, 90, -90, -90, 135, -135];
  ANGLES[-135] = [0, -45, -45, -45, 45, 45, 45, -90, -90, 90, 90, -135, 135];

  var s = makeSVG(N_X, N_Y, BORDER);

  s.rect(-BORDER, -BORDER, N_X + 2*BORDER, N_Y + 2*BORDER).attr({
    fill: Snap.rgb(BACK, BACK, BACK),
    stroke: 'none'
  });

  _.each(_.range(N_Y), function (y_i) {
    var x = 0;
    var y = y_i + 0.5;
    var width = STROKE_WIDTH * _.sample([1, 1, 1, 2, 2, 3]);
    var points = [];
    var angle = 0;
    var x_ok = false;
    while (!(x_ok)) {
      var y_ok = false;
      while (!(y_ok)) {
        var angle_try = _.sample(ANGLES[angle]);
        var r = R * (1 + Math.random());
        var x_try = x + r * Math.cos(angle_try * Math.PI / 180);
        var y_try = y + r * Math.sin(angle_try * Math.PI / 180);
        var same = Math.abs(angle - angle_try) === 0;
        if (!(same)) {
          width = STROKE_WIDTH * _.sample([1, 1, 1, 2, 2, 3]);
        }
        var opposite = Math.abs(angle - angle_try) === 180;
        y_ok = (!(opposite) && y_try >= (y_i + PAD) && y_try <= (y_i + 1 - PAD));
      }
      points.push({
        x1: x,
        y1: y,
        x2: x_try,
        y2: y_try,
        width: width
      });
      x = x_try;
      y = y_try;
      angle = angle_try;
      x_ok = (x >= N_X);
    }
    _.each(points, function (p) {
      s.line(p.x1, p.y1, p.x2, p.y2).attr({
        stroke: Snap.rgb(FORE, FORE, FORE),
        strokeWidth: p.width,
        strokeOpacity: OPACITY,
        fill: 'none'
      });
    });
  });
}
