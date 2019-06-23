/* license for this code at /license.txt */

/* global _, chroma, makeSVG, make_parameters, format_int */
/* exported regenerate */

var parameters = make_parameters('parameters', [
  {
    name: 'branch_density',
    start: [2],
    range: {
      'min': 0,
      'max': 10
    },
    format: format_int(),
    metric_name: 'n_x'
  }, {
    name: 'leaf_density',
    start: [3],
    range: {
      'min': 0,
      'max': 10
    },
    format: format_int(),
    metric_name: 'n_y'
  }, {
    name: 'n_layers',
    start: [4],
    range: {
      'min': 1,
      'max': 10
    },
    format: format_int(),
    metric_name: 'n_objects'
  }
]);

function make_branches(s, n_x, n_y, n, color, base_width, noise_scale) {
  var n_branches = 0;
  var r = n_x;
  var theta1, theta2, x1, x2, y1, y2;
  while (n_branches < n) {
    
    theta1 = 2 * Math.random() * Math.PI;
    x1 = n_x / 2 + r * Math.cos(theta1);
    y1 = n_y / 2 + r * Math.sin(theta1);
    
    theta2 = 2 * Math.random() * Math.PI;
    x2 = n_x / 2 + r * Math.cos(theta2);
    y2= n_y / 2 + r * Math.sin(theta2);
    
    s.line(x1, y1, x2, y2).attr({
      stroke: color,
      strokeWidth: base_width + noise_scale * Math.random()
    });
    
    n_branches += 1;
  }
}

function make_dots(s, n_x, n_y, n, colors, min_radius, radius_scale) {
  var n_dots = 0;
  while (n_dots < n) {
    s.circle(
      -2*radius_scale + (n_x + 4*radius_scale) * Math.random(),
      -2*radius_scale + (n_y + 4*radius_scale) * Math.random(),
      min_radius + radius_scale * Math.random()
    ).attr({
      stroke: 'none',
      fill: _.sample(colors),
    });
    n_dots += 1;
  }
}


function regenerate () {

  var N_X = 33;
  var N_Y = 33;
  
  var leaf_density = parameters['leaf_density'].slider.get();
  var branch_density = parameters['branch_density'].slider.get();
  var N_LAYERS = parameters['n_layers'].slider.get();

  var branch_color = chroma.rgb(25, 25, 25);
  var sky_color = chroma.rgb(195, 225, 255);
  var color1 = chroma('white');
  var color2 = chroma('pink');

  var scale = chroma.scale([color1, color2]).mode('lab');
  var leaf_colors = [scale(0.05), scale(0.50), scale(0.95)];
  
  var s = makeSVG(N_X, N_Y);

  s.rect(0, 0, N_X, N_Y).attr({
    'fill': sky_color.hex()
  });

  var colors;
  var MIN_RADIUS = 0.2;
  var MIN_BRANCHES = 5;
  var MIN_DOTS = 0;
  _.each(_.range(N_LAYERS), function (i) {

    var n_branches = branch_density * (MIN_BRANCHES + 200 * Math.pow((N_LAYERS - (i + 0.5)) / N_LAYERS, 2.5));
    var branch_width = 0.5 * Math.pow((i + 1) / N_LAYERS, 2.5);
    var branch_scale = 1.0 * Math.pow((i + 1) / N_LAYERS, 2.0);
    var n_dots = leaf_density * (MIN_DOTS + 500 * Math.pow((N_LAYERS - (i + 0)) / N_LAYERS, 0.5));
    var radius_scale = 0.5 * Math.pow((i + 1) / N_LAYERS, 2.0);
    var mix_factor = (N_LAYERS - (i + 1)) / N_LAYERS;
    
    colors = _.map(leaf_colors, function(color) {
      return chroma.mix(color, sky_color, mix_factor, 'lab').hex();
    });
    make_dots(
      s, N_X, N_Y,
      n_dots,
      colors,
      MIN_RADIUS,
      radius_scale
    );
    make_branches(
      s, N_X, N_Y,
      n_branches,
      chroma.mix(sky_color, branch_color, (i + 1) / N_LAYERS, 'lab').hex(),
      branch_width,
      branch_scale
    );

  });
}
