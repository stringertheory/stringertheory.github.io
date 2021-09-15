/* license for this code at /license.txt */

var parameters = make_parameters("parameters", [ {
  name: "n",
  start: [ 10 ],
  range: {
    min: 1,
    max: 15
  },
  format: format_int()
}, {
  name: "n_colors",
  start: [ 5 ],
  range: {
    min: 2,
    max: 7
  },
  format: format_int()
}, {
  name: "n_per",
  start: [ 10 ],
  range: {
    min: 1,
    max: 50
  },
  format: format_int()
}, {
  name: "jitter",
  start: [ .25 ],
  range: {
    min: 0,
    max: 1
  },
  format: format_decimal()
} ]);

function make_line(s, cx, n) {
  var points = [];
  var y = 0;
  _.each(_.range(n), function() {
    var x = cx + 2 * Math.sin(y * Math.PI / 2);
    points.push([ x, y ]);
    y += 1;
  });
  var path = convertToPath(points);
  s.path(path).attr({
    fill: "none",
    stroke: "black",
    strokeWidth: .05
  });
}

function pick_avoid(array, avoid) {
  var found = false;
  while (!found) {
    var result = _.sample(array);
    if (!avoid.includes(result)) {
      found = true;
    }
  }
  return result;
}

function tweak(color) {
  if (Math.random() < .5) {
    return color.saturate(.25 * Math.random());
  } else {
    return color.desaturate(.25 * Math.random());
  }
}

function color_set(n) {
  var offset = 360 * Math.random();
  var result = [];
  _.each(_.range(n), function(i) {
    var h = offset + 360 / n * i;
    var sat = .9;
    var v = .9;
    var color = chroma.hsv(h, sat, v);
    result.push(color);
  });
  return result;
}

function luvcolor(h, s, l) {
  var rgb = hsluv.hsluvToRgb([ h, s, l ]);
  return chroma.rgb(rgb[0] * 255, rgb[1] * 255, rgb[2] * 255);
}

function color_scheme(n) {
  var diff = 0;
  while (diff < 120) {
    var hue_a = _.random(0, 360);
    var hue_b = _.random(0, 360);
    diff = Math.abs(hue_b - hue_a);
  }
  diff = 0;
  while (diff < 5) {
    var sat_a = _.random(90, 100);
    var sat_b = _.random(90, 100);
    diff = Math.abs(sat_b - sat_a);
  }
  diff = 0;
  while (diff < 50) {
    var lig_a = _.random(20, 80);
    var lig_b = _.random(20, 80);
    diff = Math.abs(lig_b - lig_a);
  }
  var changeHue = (hue_b - hue_a) / n;
  var changeSat = (sat_b - sat_a) / n;
  var changeLig = (lig_b - lig_a) / n;
  var colors = [];
  _.each(_.range(n), function(i) {
    colors.push(luvcolor(hue_a + i * changeHue, sat_a + i * changeSat, lig_a + i * changeLig));
  });
  return colors;
}

function regenerate() {
  var N_COLORS = parameters["n_colors"].slider.get();
  var N_X = parameters["n"].slider.get();
  var N_Y = parameters["n"].slider.get();
  var N_PER = parameters["n_per"].slider.get();
  var JITTER_AMOUNT = parameters["jitter"].slider.get();
  var BORDER = .5;
  var s = makeSVG(N_X, N_Y, BORDER);
  var bgColor = chroma.rgb(250, 250, 250);
  s.rect(-BORDER, -BORDER, N_X + 2 * BORDER, N_Y + 2 * BORDER).attr({
    stroke: "none",
    fill: bgColor.hex()
  });
  var colors = color_set(N_COLORS);
  var color = null;
  var cx = N_X / 4;
  var ny = N_PER;
  _.each(_.range(N_Y), function(y) {
    cx += .05;
    _.each(_.range(ny), function(i) {
      var rectWidth = .5 + 1 * Math.random();
      var jitter = JITTER_AMOUNT * (Math.random() - .5);
      var x = cx + jitter;
      if (y % 2) {
        x = cx + jitter - rectWidth;
      }
      color = pick_avoid(colors, [ color ]);
      var triWidth = .25 + 1 * Math.random();
      var yy = y + i / ny;
      if (Math.random() < .5) {
        yy = y + (i + 1) / ny;
      }
      var trianglePoints = [ x + rectWidth, y + i / ny, x + rectWidth, y + (i + 1) / ny, x + rectWidth + triWidth, yy ];
      if (Math.random() < .9) {
        s.polygon(trianglePoints).attr({
          fill: tweak(_.sample(colors)).hex()
        });
      }
      var triWidth = .25 + 1 * Math.random();
      var yy = y + i / ny;
      if (Math.random() < .5) {
        yy = y + (i + 1) / ny;
      }
      var trianglePoints = [ x, y + i / ny, x, y + (i + 1) / ny, x - triWidth, yy ];
      if (Math.random() < .9) {
        s.polygon(trianglePoints).attr({
          fill: tweak(_.sample(colors)).hex()
        });
      }
    });
  });
  var cx = 3 * N_X / 4;
  _.each(_.range(N_Y), function(y) {
    cx -= .05;
    _.each(_.range(ny), function(i) {
      var rectWidth = .5 + 1 * Math.random();
      var jitter = JITTER_AMOUNT * (Math.random() - .5);
      var x = cx + jitter - rectWidth;
      if (y % 2) {
        x = cx + jitter;
      }
      color = pick_avoid(colors, [ color ]);
      var triWidth = .25 + 1 * Math.random();
      var yy = y + i / ny;
      if (Math.random() < .5) {
        yy = y + (i + 1) / ny;
      }
      var trianglePoints = [ x + rectWidth, y + i / ny, x + rectWidth, y + (i + 1) / ny, x + rectWidth + triWidth, yy ];
      if (Math.random() < .9) {
        s.polygon(trianglePoints).attr({
          fill: tweak(_.sample(colors)).hex()
        });
      }
      var triWidth = .25 + 1 * Math.random();
      var yy = y + i / ny;
      if (Math.random() < .5) {
        yy = y + (i + 1) / ny;
      }
      var trianglePoints = [ x, y + i / ny, x, y + (i + 1) / ny, x - triWidth, yy ];
      if (Math.random() < .9) {
        s.polygon(trianglePoints).attr({
          fill: tweak(_.sample(colors)).hex()
        });
      }
    });
  });
  var N_TEXTURE = 0;
  var TEXTURE_COLOR = chroma("white").brighten(2);
  var TEXTURE_WIDTH = .05;
  var TEXTURE_HEIGHT = .4;
  var TEXTURE_OPACITY = .01;
  _.each(_.range(N_TEXTURE), function(i) {
    var x = N_X * Math.random();
    var y = N_Y * Math.random();
    s.ellipse(x, y, TEXTURE_WIDTH * Math.random(), TEXTURE_HEIGHT * Math.random()).attr({
      fill: TEXTURE_COLOR,
      opacity: TEXTURE_OPACITY
    });
  });
}
