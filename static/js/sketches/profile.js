/* license for this code at /license.txt */

/* global _,  makeSVG, make_parameters, format_int, noise, format_decimal */
/* exported regenerate */

var parameters = make_parameters('parameters', [
  {
    name: 'n_inside',
    start: [11],
    range: {'min': 1, 'max': 42},
    format: format_int(),
    metric_name: 'n_x'
  }, {
    name: 'n_outside',
    start: [17],
    range: {'min': 1, 'max': 42},
    format: format_int(),
    metric_name: 'n_y'
  }, {
    name: 'stroke_width',
    start: [0.01],
    range: {
      'min': 0.001,
      '50%': 0.01,
      'max': 0.1
    },
    format: format_decimal()
  }, {
    name: 'perlin_noise',
    start: [0.25],
    range: {
      'min': 0,
      '50%': 0.5,
      'max': 1.5
    },
    metric_name: 'grid_jitter'
  }, {
    name: 'random_noise',
    start: [0],
    range: {
      'min': 0,
      'max': 0.25
    },
    metric_name: 'grid_jitter_2'
  }, {
    name: 'n_sides',
    start: [17],
    range: {
      'min': 3,
      '50%': 17,
      'max': 60
    },
    format: format_int(),
    metric_name: 'n_objects'
  }
]);

function ngon(angle, n, rotation=0) {
  return Math.cos(Math.PI / n) / Math.cos(((angle + rotation) % (2 * Math.PI / n)) - (Math.PI / n));
}

function regenerate () {

  var FACE = [[0.8222702, 0.0182779], [0.8047702, 0.0432779], [0.7765202, 0.1057779], [0.7410202, 0.1557779], [0.7260202, 0.2232779], [0.6740202, 0.3257779], [0.6197702, 0.3882779], [0.5677702, 0.4207779], [0.5227702, 0.3907779], [0.4850202, 0.3657779], [0.4282702, 0.3357779], [0.4282702, 0.3657779], [0.4157702, 0.3657779], [0.4890202, 0.4782779], [0.4740202, 0.5032779], [0.4763702, 0.5707779], [0.4456202, 0.5982779], [0.4148702, 0.6232779], [0.3746202, 0.6232779], [0.3521202, 0.6507779], [0.3191202, 0.6757779], [0.3041202, 0.6507779], [0.2866202, 0.6757779], [0.3091202, 0.7582779], [0.3421202, 0.8607779], [0.3728702, 0.9532779], [0.3928702, 1.0557779], [0.3952202, 1.1582779], [0.3902202, 1.2682779], [0.2272202, 1.3157779], [0.0712202, 1.3407779], [-0.0515298, 1.3657779], [-0.1815298, 1.3657779], [-0.3210298, 1.3657779], [-0.4697798, 1.3357779], [-0.5287798, 1.3107779], [-0.4792798, 1.1632779], [-0.4250298, 1.0332779], [-0.3895298, 0.9082779], [-0.4020298, 0.8582779], [-0.4245298, 0.7532779], [-0.4470298, 0.6757779], [-0.4670298, 0.6182779], [-0.4795298, 0.5682779], [-0.5077798, 0.4782779], [-0.6022798, 0.5032779], [-0.6802798, 0.5032779], [-0.7487798, 0.5007779], [-0.8077798, 0.4757779], [-0.8480298, 0.4407779], [-0.8580298, 0.4007779], [-0.8556548, 0.3382779], [-0.8481548, 0.2857779], [-0.8764048, 0.2607779], [-0.8864048, 0.2357779], [-0.8914048, 0.2057779], [-0.8739048, 0.1807779], [-0.8314048, 0.1482779], [-0.8337798, 0.1232779], [-0.8880298, 0.1232779], [-0.9005298, 0.1232779], [-0.8830298, 0.0982779], [-0.8680298, 0.0482779], [-0.8880298, 0.0232779], [-0.9055298, 0.0232779], [-0.9457798, -0.0017221], [-0.9812798, -0.0292221], [-0.99127979, -0.0642221], [-0.9762798, -0.1017221], [-0.9195298, -0.1642221], [-0.8675298, -0.2292221], [-0.8450298, -0.2667221], [-0.8250298, -0.2917221], [-0.8100298, -0.3317221], [-0.8076798, -0.3892221], [-0.8053048, -0.4517221], [-0.7828048, -0.5392221], [-0.7450548, -0.6292221], [-0.7095548, -0.7017221], [-0.6363048, -0.7542221], [-0.6363048, -0.7542221], [-0.6189798, -0.8292221], [-0.5599798, -0.8917221], [-0.4844798, -0.9317221], [-0.3947298, -0.9567221], [-0.2977298, -0.9817221], [-0.2079798, -0.9817221], [-0.1252298, -0.9817221], [-0.1629798, -1.0092221], [-0.1429798, -1.0442221], [-0.0767298, -1.0917221], [-0.0104798, -1.1217221], [0.0437702, -1.1467221], [0.0932702, -1.1467221], [0.1310202, -1.1142221], [0.1535202, -1.0817221], [0.1960202, -1.0817221], [0.2952702, -1.1067221], [0.3707702, -1.1067221], [0.4605202, -1.0817221], [0.5550202, -1.0217221], [0.6330202, -0.9742221], [0.7132702, -0.9292221], [0.7700202, -0.8717221], [0.8102702, -0.8092221], [0.8480202, -0.7667221], [0.8882702, -0.6742221], [0.9165202, -0.6317221], [0.9315202, -0.5867221], [0.9440202, -0.4867221], [0.9640202, -0.4617221], [0.9815202, -0.4292221], [0.9815202, -0.3792221], [0.8940202, -0.2292221], [0.9090202, -0.1917221], [0.8865202, -0.1617221], [0.8865202, -0.1217221], [0.8297702, -0.0267221]];
  
  var N_X = 4;
  var N_Y = 4;
  var N_POINTS = FACE.length;
  var N_INSIDE = parameters['n_inside'].slider.get();
  var N_OUTSIDE = parameters['n_outside'].slider.get();
  var STROKE_WIDTH = parameters['stroke_width'].slider.get();

  var PERLIN = parameters['perlin_noise'].slider.get();
  var RANDOM = parameters['random_noise'].slider.get();
  var N_SIDES = parameters['n_sides'].slider.get();

  var PERLIN_OUTSIDE = PERLIN;
  var RANDOM_OUTSIDE = RANDOM;
  var N_SIDES_OUTSIDE = N_SIDES;
  var PERLIN_INSIDE = PERLIN;
  var RANDOM_INSIDE = RANDOM;
  var N_SIDES_INSIDE = N_SIDES;
  
  var BORDER = 0.5;
  var s = makeSVG(N_X, N_Y, BORDER);

  var all_points = [];
  _.each(_.range(1 + N_OUTSIDE), function (dummy) {
    all_points.push([]);
  });
  _.each(_.range(2 + N_INSIDE), function (dummy) {
    all_points.push([]);
  });
  
  noise.seed(Math.random());
  _.each(_.range(N_POINTS), function (i) {
    var angle = 2 * Math.PI * i / N_POINTS;

    var x_noise = 2 * Math.cos(angle);
    var y_noise = 2 * Math.sin(angle);
    var x_noise2 = 2 * Math.cos(angle + Math.PI / 2);
    var y_noise2 = 2 * Math.sin(angle + Math.PI / 2);

    // var r_mid = ngon(angle, 60) + 0.5 * noise.perlin2(x_noise3, y_noise3)
    // var x_mid = 2 + r_mid * Math.cos(angle);
    // var y_mid = 2 + r_mid * Math.sin(angle);
    var x_mid = 2 + FACE[i][0];
    var y_mid = 2 + FACE[i][1];

    var r_out = ngon(angle, N_SIDES_OUTSIDE);
    r_out += PERLIN_OUTSIDE * noise.perlin2(x_noise, y_noise);
    r_out += RANDOM_OUTSIDE * (Math.random() - 0.5);
    var x_out = 2 + 2 * r_out * Math.cos(angle);
    var y_out = 2 + 2 * r_out * Math.sin(angle);

    var r_in = ngon(angle, N_SIDES_INSIDE);
    r_in += PERLIN_INSIDE * noise.perlin2(x_noise2, y_noise2);
    r_in += RANDOM_INSIDE * (Math.random() - 0.5);
    var x_in = 2 + 0.3 * r_in * Math.cos(angle);
    var y_in = 2 + 0.3 * r_in * Math.sin(angle);

    var index = 0;
    _.each(_.range(1 + N_OUTSIDE), function (j) {
      var f = j / (1 + N_OUTSIDE);
      var x = f * x_mid + (1 - f) * x_out;
      var y = f * y_mid + (1 - f) * y_out;
      all_points[j].push([x, y]);
      index += 1;
    });
    _.each(_.range(2 + N_INSIDE), function (j) {
      var f = j / (1 + N_INSIDE);
      var x = f * x_in + (1 - f) * x_mid;
      var y = f * y_in + (1 - f) * y_mid;
      all_points[index + j].push([x, y]);
    });
  });
  _.each(all_points, function(points) {
    s.polygon(points).attr({
      stroke: 'black',
      fill: 'none',
      strokeWidth: STROKE_WIDTH,
    });
  });
  
}
