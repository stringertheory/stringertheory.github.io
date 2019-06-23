/* license for this code at /license.txt */

/* global _, Snap, makeSVG, make_parameters, format_int */
/* exported regenerate */

// http://gooddesignisgoodbusiness.tumblr.com/post/81138717065/the-cognitivie-puzzles-ogilvy-campaign-for-ibm

var parameters = make_parameters('parameters', [
  {
    name: 'n_x',
    start: [11],
    range: {
      'min': 1,
      'max': 30
    },
    format: format_int()
  }, {
    name: 'n_y',
    start: [11],
    range: {
      'min': 1,
      'max': 30
    },
    format: format_int()
  }, {
    name: 'n_lines',
    start: [5],
    range: {
      'min': 1,
      'max': 30
    },
    format: format_int(),
    metric: 'n_objects'
  }, {
    name: 'thickness',
    start: [0.1],
    range: {
      'min': 0.0,
      '50%': 0.1,
      'max': 1
    },
    metric: 'stroke_width'
  }, {
    name: 'p_circle',
    start: [0.2],
    range: {
      'min': 0.0,
      '50%': 0.2,
      'max': 1
    },
    metric: 'n_texture'
  }
]);


function regenerate () {

  var N_X = parameters['n_x'].slider.get();
  var N_Y = parameters['n_y'].slider.get();
  var DELTA = parameters['thickness'].slider.get();
  var N_LINES = parameters['n_lines'].slider.get();
  var P_CIRCLE = parameters['p_circle'].slider.get();
  
  var s = makeSVG(N_X, N_Y);
  
  // make a series of N_Y polygons with the irregular horizontal lines
  _.each(_.range(N_Y), function (y) {
    var cy = y;
    _.each(_.range(N_LINES), function (dy) {
      y = cy + dy * 2 * DELTA;
      if (Math.random() < 0.25) {
        var color = Snap.rgb(0, 150, 214);
        if (Math.random() < 0.5) {
          color = Snap.rgb(227, 6, 19);
        }
        var transition_point = _.random(0, N_X - 3);
        var sign = _.sample([-1, 1]);
        var h = 2;
        var line = [
          [0, y],
          [transition_point, y],
          [transition_point + h, y + sign * h],
          [N_X, y + sign * h],
          [N_X, y + sign * h - sign * DELTA],
          [transition_point + h + 1, y + sign * h - sign * DELTA],
          [transition_point + 1, y - sign * DELTA],
          [0, y - sign * DELTA]
        ];
        s.polyline(line).attr({
          stroke: 'none',
          fill: color,
          style: 'mix-blend-mode: darken'
        });
      }
    });     
  });

  _.each(_.range(1, N_Y), function (y) {
    _.each(_.range(1, N_X), function (x) {
      if (Math.random() < P_CIRCLE) {
        s.circle(
          x + 0.5 * (Math.random() - 0.5),
          y + 0.5 * (Math.random() - 0.5),
          0.25
        ).attr({
          stroke: 'red',
          strokeWidth: 0,
          fill: 'black'
        });
      }
    });
  });
}
