/* license for this code at /license.txt */

var parameters = make_parameters("parameters", [ {
  name: "n_inside",
  start: [ 11 ],
  range: {
    min: 1,
    max: 42
  },
  format: format_int(),
  metric_name: "n_x"
}, {
  name: "n_outside",
  start: [ 17 ],
  range: {
    min: 1,
    max: 42
  },
  format: format_int(),
  metric_name: "n_y"
}, {
  name: "stroke_width",
  start: [ .01 ],
  range: {
    min: .001,
    "50%": .01,
    max: .1
  },
  format: format_decimal()
}, {
  name: "perlin_noise",
  start: [ .25 ],
  range: {
    min: 0,
    "50%": .5,
    max: 1.5
  },
  metric_name: "grid_jitter"
}, {
  name: "random_noise",
  start: [ 0 ],
  range: {
    min: 0,
    max: .25
  },
  metric_name: "grid_jitter_2"
}, {
  name: "n_sides",
  start: [ 17 ],
  range: {
    min: 3,
    "50%": 17,
    max: 60
  },
  format: format_int(),
  metric_name: "n_objects"
} ]);

function ngon(angle, n, rotation = 0) {
  var num = Math.cos(Math.PI / n);
  var denom = Math.cos((angle + rotation) % (2 * Math.PI / n) - Math.PI / n);
  return num / denom;
}

function regenerate() {
  var FACE = [ [ .8222702, .0182779 ], [ .8047702, .0432779 ], [ .7765202, .1057779 ], [ .7410202, .1557779 ], [ .7260202, .2232779 ], [ .6740202, .3257779 ], [ .6197702, .3882779 ], [ .5677702, .4207779 ], [ .5227702, .3907779 ], [ .4850202, .3657779 ], [ .4282702, .3357779 ], [ .4282702, .3657779 ], [ .4157702, .3657779 ], [ .4890202, .4782779 ], [ .4740202, .5032779 ], [ .4763702, .5707779 ], [ .4456202, .5982779 ], [ .4148702, .6232779 ], [ .3746202, .6232779 ], [ .3521202, .6507779 ], [ .3191202, .6757779 ], [ .3041202, .6507779 ], [ .2866202, .6757779 ], [ .3091202, .7582779 ], [ .3421202, .8607779 ], [ .3728702, .9532779 ], [ .3928702, 1.0557779 ], [ .3952202, 1.1582779 ], [ .3902202, 1.2682779 ], [ .2272202, 1.3157779 ], [ .0712202, 1.3407779 ], [ -.0515298, 1.3657779 ], [ -.1815298, 1.3657779 ], [ -.3210298, 1.3657779 ], [ -.4697798, 1.3357779 ], [ -.5287798, 1.3107779 ], [ -.4792798, 1.1632779 ], [ -.4250298, 1.0332779 ], [ -.3895298, .9082779 ], [ -.4020298, .8582779 ], [ -.4245298, .7532779 ], [ -.4470298, .6757779 ], [ -.4670298, .6182779 ], [ -.4795298, .5682779 ], [ -.5077798, .4782779 ], [ -.6022798, .5032779 ], [ -.6802798, .5032779 ], [ -.7487798, .5007779 ], [ -.8077798, .4757779 ], [ -.8480298, .4407779 ], [ -.8580298, .4007779 ], [ -.8556548, .3382779 ], [ -.8481548, .2857779 ], [ -.8764048, .2607779 ], [ -.8864048, .2357779 ], [ -.8914048, .2057779 ], [ -.8739048, .1807779 ], [ -.8314048, .1482779 ], [ -.8337798, .1232779 ], [ -.8880298, .1232779 ], [ -.9005298, .1232779 ], [ -.8830298, .0982779 ], [ -.8680298, .0482779 ], [ -.8880298, .0232779 ], [ -.9055298, .0232779 ], [ -.9457798, -.0017221 ], [ -.9812798, -.0292221 ], [ -.99127979, -.0642221 ], [ -.9762798, -.1017221 ], [ -.9195298, -.1642221 ], [ -.8675298, -.2292221 ], [ -.8450298, -.2667221 ], [ -.8250298, -.2917221 ], [ -.8100298, -.3317221 ], [ -.8076798, -.3892221 ], [ -.8053048, -.4517221 ], [ -.7828048, -.5392221 ], [ -.7450548, -.6292221 ], [ -.7095548, -.7017221 ], [ -.6363048, -.7542221 ], [ -.6363048, -.7542221 ], [ -.6189798, -.8292221 ], [ -.5599798, -.8917221 ], [ -.4844798, -.9317221 ], [ -.3947298, -.9567221 ], [ -.2977298, -.9817221 ], [ -.2079798, -.9817221 ], [ -.1252298, -.9817221 ], [ -.1629798, -1.0092221 ], [ -.1429798, -1.0442221 ], [ -.0767298, -1.0917221 ], [ -.0104798, -1.1217221 ], [ .0437702, -1.1467221 ], [ .0932702, -1.1467221 ], [ .1310202, -1.1142221 ], [ .1535202, -1.0817221 ], [ .1960202, -1.0817221 ], [ .2952702, -1.1067221 ], [ .3707702, -1.1067221 ], [ .4605202, -1.0817221 ], [ .5550202, -1.0217221 ], [ .6330202, -.9742221 ], [ .7132702, -.9292221 ], [ .7700202, -.8717221 ], [ .8102702, -.8092221 ], [ .8480202, -.7667221 ], [ .8882702, -.6742221 ], [ .9165202, -.6317221 ], [ .9315202, -.5867221 ], [ .9440202, -.4867221 ], [ .9640202, -.4617221 ], [ .9815202, -.4292221 ], [ .9815202, -.3792221 ], [ .8940202, -.2292221 ], [ .9090202, -.1917221 ], [ .8865202, -.1617221 ], [ .8865202, -.1217221 ], [ .8297702, -.0267221 ] ];
  var N_X = 4;
  var N_Y = 4;
  var N_POINTS = FACE.length;
  var N_INSIDE = parameters["n_inside"].slider.get();
  var N_OUTSIDE = parameters["n_outside"].slider.get();
  var STROKE_WIDTH = parameters["stroke_width"].slider.get();
  var PERLIN = parameters["perlin_noise"].slider.get();
  var RANDOM = parameters["random_noise"].slider.get();
  var N_SIDES = parameters["n_sides"].slider.get();
  var PERLIN_OUTSIDE = PERLIN;
  var RANDOM_OUTSIDE = RANDOM;
  var N_SIDES_OUTSIDE = N_SIDES;
  var PERLIN_INSIDE = PERLIN;
  var RANDOM_INSIDE = RANDOM;
  var N_SIDES_INSIDE = N_SIDES;
  var BORDER = .5;
  var s = makeSVG(N_X, N_Y, BORDER);
  var all_points = [];
  _.each(_.range(1 + N_OUTSIDE), function(dummy) {
    all_points.push([]);
  });
  _.each(_.range(2 + N_INSIDE), function(dummy) {
    all_points.push([]);
  });
  noise.seed(Math.random());
  _.each(_.range(N_POINTS), function(i) {
    var angle = 2 * Math.PI * i / N_POINTS;
    var x_noise = 2 * Math.cos(angle);
    var y_noise = 2 * Math.sin(angle);
    var x_noise2 = 2 * Math.cos(angle + Math.PI / 2);
    var y_noise2 = 2 * Math.sin(angle + Math.PI / 2);
    var x_mid = 2 + FACE[i][0];
    var y_mid = 2 + FACE[i][1];
    var r_out = ngon(angle, N_SIDES_OUTSIDE);
    r_out += PERLIN_OUTSIDE * noise.perlin2(x_noise, y_noise);
    r_out += RANDOM_OUTSIDE * (Math.random() - .5);
    var x_out = 2 + 2 * r_out * Math.cos(angle);
    var y_out = 2 + 2 * r_out * Math.sin(angle);
    var r_in = ngon(angle, N_SIDES_INSIDE);
    r_in += PERLIN_INSIDE * noise.perlin2(x_noise2, y_noise2);
    r_in += RANDOM_INSIDE * (Math.random() - .5);
    var x_in = 2 + .3 * r_in * Math.cos(angle);
    var y_in = 2 + .3 * r_in * Math.sin(angle);
    var index = 0;
    _.each(_.range(1 + N_OUTSIDE), function(j) {
      var f = j / (1 + N_OUTSIDE);
      var x = f * x_mid + (1 - f) * x_out;
      var y = f * y_mid + (1 - f) * y_out;
      all_points[j].push([ x, y ]);
      index += 1;
    });
    _.each(_.range(2 + N_INSIDE), function(j) {
      var f = j / (1 + N_INSIDE);
      var x = f * x_in + (1 - f) * x_mid;
      var y = f * y_in + (1 - f) * y_mid;
      all_points[index + j].push([ x, y ]);
    });
  });
  _.each(all_points, function(points) {
    s.polygon(points).attr({
      stroke: "black",
      fill: "none",
      strokeWidth: STROKE_WIDTH
    });
  });
}
