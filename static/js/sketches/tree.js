/* license for this code at /license.txt */

/* global _, chroma, makeSVG, make_parameters, format_int */
/* exported regenerate */

function make_key(x, y, z) {
  return [x, y, z].join('.');
}

function is_visited(x, y, z, lookup, max_x, max_y) {
  if (x >= max_x || x < 0) {
    return true;
  } else if (y >= max_y || y < 0) {
    return true;
  } else if (lookup.hasOwnProperty(make_key(x, y, z))) {
    return true;
  }
  return false;
}

function mark(x, y, z, lookup) {
  lookup[make_key(x, y, z)] = true;
}

function regenerate () {
  
  var N_X = 13 * 5;
  var N_Y = 13 * 5;
  var m = 5;
  
  // warm leaves
  var colors = [
    chroma.rgb(224, 27, 23),
    chroma.rgb(224, 200, 50),
    chroma.rgb(224, 116, 45)
  ];

  var s = makeSVG(N_X, N_Y);

  s.rect(-N_X, -N_Y, 3 * N_X, 3 * N_Y).attr({
    'fill': chroma.rgb(220, 220, 220).hex(),
  });

  var n_branches = 0;
  var N_BRANCHES = 100 * m;
  while (n_branches < N_BRANCHES) {

    var r = N_X;

    var theta1 = 2 * Math.random() * Math.PI;
    var x1 = N_X / 2 + r * Math.cos(theta1);
    var y1 = N_Y / 2 + r * Math.sin(theta1);

    var theta2 = 2 * Math.random() * Math.PI;
    var x2 = N_X / 2 + r * Math.cos(theta2);
    var y2= N_Y / 2 + r * Math.sin(theta2);
    
    s.line(x1, y1, x2, y2).attr({
      stroke: chroma.rgb(200, 200, 190),
      strokeWidth: 0.025 + 0.25 * Math.random()
    });
    
    n_branches += 1;
  }

  var n_dots = 0;
  var N_DOTS = 1000 * m;
  while (n_dots < N_DOTS) {
    s.circle(
        -2 + (N_X + 4) * Math.random(),
        -2 + (N_Y + 4) * Math.random(),
      0.5 * Math.random()
    ).attr({
      stroke: 'none',
      fill: _.sample(colors),
    });
    n_dots += 1;
  }

  
  n_branches = 0;
  N_BRANCHES = 100 * m;
  while (n_branches < N_BRANCHES) {

    var r = N_X;

    var theta1 = 2 * Math.random() * Math.PI;
    var x1 = N_X / 2 + r * Math.cos(theta1);
    var y1 = N_Y / 2 + r * Math.sin(theta1);

    var theta2 = 2 * Math.random() * Math.PI;
    var x2 = N_X / 2 + r * Math.cos(theta2);
    var y2= N_Y / 2 + r * Math.sin(theta2);
    
    s.line(x1, y1, x2, y2).attr({
      stroke: chroma.rgb(100, 100, 90),
      strokeWidth: 0.05 + 0.5 * Math.random()
    });
    
    n_branches += 1;
  }

  var n_dots = 0;
  var N_DOTS = 1000 * m;
  while (n_dots < N_DOTS) {
    s.circle(
        -2 + (N_X + 4) * Math.random(),
        -2 + (N_Y + 4) * Math.random(),
      0.5 * Math.random()
    ).attr({
      stroke: 'none',
      fill: _.sample(colors),
    });
    n_dots += 1;
  }

  var n_branches = 0;
  var N_BRANCHES = 10 * m;
  while (n_branches < N_BRANCHES) {

    var r = N_X;

    var theta1 = 2 * Math.random() * Math.PI;
    var x1 = N_X / 2 + r * Math.cos(theta1);
    var y1 = N_Y / 2 + r * Math.sin(theta1);

    var theta2 = 2 * Math.random() * Math.PI;
    var x2 = N_X / 2 + r * Math.cos(theta2);
    var y2= N_Y / 2 + r * Math.sin(theta2);
    
    s.line(x1, y1, x2, y2).attr({
      stroke: chroma.rgb(15, 15, 10),
      strokeWidth: 0.5 + Math.random()
    });
    
    n_branches += 1;
  }
  
}
