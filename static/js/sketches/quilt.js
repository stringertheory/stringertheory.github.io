/* license for this code at /license.txt */

/* global _, chroma, Snap, makeSVG, make_parameters, jitter,
   format_int, compliment */
/* exported regenerate */

var parameters = make_parameters('parameters', [
  {
    name: 'n_x',
    start: [11],
    range: {'min': 1, 'max': 30},
    format: format_int()
  }, {
    name: 'n_y',
    start: [11],
    range: {'min': 1, 'max': 30},
    format: format_int()
  }, {
    name: 'n_colors',
    start: [2],
    range: {'min': 2, 'max': 20},
    format: format_int()
  }, {
    name: 'stroke_width',
    start: [0],
    range: {'min': 0, 'max': 0.2},
  }, {
    name: 'stroke_width_inner',
    start: [0],
    range: {'min': 0, 'max': 0.2},
  }, {
    name: 'grid_jitter',
    start: [0.5],
    range: {'min': 0, 'max': 1},
  }
]);

// http://simoncpage.co.uk/blog/2009/08/random-dance-geometric-poster-designs/
// http://www.pbase.com/brownsf/amish_quilts
// http://www.pbase.com/brownsf/image/84992170
// http://www.pbase.com/brownsf/image/12150606
function rando() {
  var h = 360 * Math.random();
  var c = 80 + 20 * Math.random();
  var l = 80 + 20 * Math.random();
  return chroma.hcl(h, c, l);
}

function regenerate () {
  
  var N_X = parameters['n_x'].get();
  var N_Y = parameters['n_y'].get();
  var N_COLORS = parameters['n_colors'].get();
  var STROKE_WIDTH = parameters['stroke_width'].get();
  var BOX_STROKE_WIDTH = parameters['stroke_width_inner'].get();
  var GRID_JITTER = parameters['grid_jitter'].get();
  
  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y);

  var color1 = rando();
  var colors = [];
  colors.push(color1);
  _.each(_.range(1, N_COLORS), function (i) {
    var color = compliment(
      color1, i * 360 / N_COLORS,
      0.5 * (1 + Math.random())
    ).hex();
    colors.push(color);
  });
  // var colors = chroma.scale([color1, compliment(color1)]).colors(N_COLORS)
  var stroker = colors[0];

  s.rect(0, 0, N_X, N_Y).attr({
    fill: colors[0],
    stroke: 'none'
  });
  
  var grid = [];
  _.each(_.range(N_X + 1), function (x) {
    var row = [];
    _.each(_.range(N_Y + 1), function (y) {
      if (x > 0 && y > 0 && x < N_X && y < N_Y) {
        row.push([x + jitter(GRID_JITTER), y + jitter(GRID_JITTER)]);
      } else {
        row.push([x, y]);
      }
    });
    grid.push(row);
  });
  
  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {

      colors = _.shuffle(colors);
      
      var group = s.g();
      
      _.each(colors, function (color, index) {
        var height = 2 * (colors.length - index) / colors.length;
        group.add(s.rect(x - 0.5, y - 0.5, 2, height).attr({
          fill: color,
          stroke: stroker,
          strokeWidth: BOX_STROKE_WIDTH
        }));
      });
      var path = [
        grid[x][y],
        grid[x + 1][y],
        grid[x + 1][y + 1],
        grid[x][y + 1]
      ];
      var clipper = s.polyline(path);
      s.polyline(path).attr({
        fill: 'none',
        stroke: stroker,
        strokeWidth: STROKE_WIDTH
      });
      if (Math.random() < 1) {
        var angle = 360 * (Math.random() - 0.5);
        group.transform(
          Snap.format('r{angle},{x_center},{y_center}', {
            angle: angle,
            x_center: x + 0.5,
            y_center: y + 0.5
          })
        );
        clipper.transform(
          Snap.format('r{angle},{x_center},{y_center}', {
            angle: -angle,
            x_center: x + 0.5,
            y_center: y + 0.5
          })
        );
      }
      group.attr({
        clip: clipper
      });
    });
  });
}


window.onload = function() {
};
