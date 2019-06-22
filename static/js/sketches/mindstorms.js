/* license for this code at /license.txt */

/* global _, chroma, Snap, makeSVG, compliment, make_parameters, format_int */
/* exported regenerate */

var parameters = make_parameters('parameters', [
  {
    name: 'n_flowers',
    start: [42],
    range: {'min': 1, 'max': 100},
    format: format_int(),
    metric_name: 'n_objects'
  }, {
    name: 'n_colors',
    start: [3],
    range: {'min': 1, 'max': 10},
    format: format_int()
  }
]);


function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function petal(svg, x, y, length, angle) {
  var g = svg.g();
  g.add(svg.path(Snap.format('M {x1} {y1} A {r} {r} 0 0 {sweep} {x2} {y2}', {
    x1: x,
    y1: y,
    r: length / Math.sqrt(2),
    x2: x + length,
    y2: y,
    sweep: 1
  })));
  g.add(svg.path(Snap.format('M {x1} {y1} A {r} {r} 0 0 {sweep} {x2} {y2}', {
    x1: x,
    y1: y,
    r: length / Math.sqrt(2),
    x2: x + length,
    y2: y,
    sweep: 0
  })));
  g.transform(Snap.format('r{angle},{x_center},{y_center}', {
    angle: angle * (180 / Math.PI),
    x_center: x,
    y_center: y
  }));
  return g;
}

function flower(svg, x, y, radius, color, nPetals, angleOffset) {
  var g = svg.g();
  _.each(_.range(nPetals), function (i) {
    var angle = 2 * Math.PI * i / nPetals + angleOffset;
    // g.add(svg.line(x, y, x, 10000).attr({
    //   stroke: 'green',
    //   strokeWidth: 0.01,
    //   strokeOpacity: 0.1
    // }));
    var p = petal(svg, x, y, radius, angle);
    p.attr({
      fill: color,
      fillOpacity: 0.5,
      stroke: 'black',
      strokeWidth: 0.01,
      strokeOpacity: 0.5
    });
    g.add(p);
  });
  return g;
}

function overlap (shapes, x, y, n, max) {
  if (n >= max) {
    return false;
  } else {
    return _.any(shapes, function (shape) {
      var bbox = shape.getBBox();
      return Snap.path.isPointInsideBBox(bbox, x, y);
    });
  }
}

function regenerate () {

  var N_X = 9;
  var N_Y = 9;
  var N_FLOWERS = parameters['n_flowers'].slider.get();
  var MAX_TRIES = 0;
  var N_COLORS = parameters['n_colors'].slider.get();
  
  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y);

  var base_color = chroma.random();
  var colors = [base_color.hex()];
  _.each(_.range(N_COLORS - 1), function (i) {
    colors.push(compliment(base_color, (i + 1) * (90 / (N_COLORS - 1))).hex());
  });
  
  var flowers = [];
  var nFlowers = 0;
  while (nFlowers < N_FLOWERS) {
    var nTries = 0;
    do {
      var x = 1 + Math.random() * (N_X - 2);
      var y = 1 + Math.random() * (N_Y - 2);
      nTries += 1;
    }
    while (overlap(flowers, x, y, nTries, MAX_TRIES));
    var angleOffset = Math.random() * 2 * Math.PI;
    var nPetals = randomInt(5, 13);
    var radius = 0.25 + 0.75 * Math.random();
    var color = colors[_.random(N_COLORS - 1)];
    flowers.push(flower(s, x, y, radius, color, nPetals, angleOffset));
    nFlowers += 1;
  }
  
}
