

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function petal(svg, x, y, length, angle) {
  var g = svg.g()
  g.add(svg.path(Snap.format("M {x1} {y1} A {r} {r} 0 0 {sweep} {x2} {y2}", {
    x1: x,
    y1: y,
    r: length / Math.sqrt(2),
    x2: x + length,
    y2: y,
    sweep: 1
  })));
  g.add(svg.path(Snap.format("M {x1} {y1} A {r} {r} 0 0 {sweep} {x2} {y2}", {
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

  var SVG_ID = '#canvas'
  var N_X = 10
  var N_Y = 10
  var N_FLOWERS = 42;
  var MAX_TRIES = 0;
  
  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y)

  var base_color = chroma.random();
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
    var radius = 0.25 + 0.5 * Math.random();
    var color = base_color;
    if (Math.random() < 0.5) {
      color = compliment(base_color);
    }
    flowers.push(flower(s, x, y, radius, color, nPetals, angleOffset));
    nFlowers += 1;
  }
  
}
