/* license for this code at /license.txt */

/* global _, chroma, Snap, makeSVG, make_parameters, jitter,
   format_int, compliment */
/* exported regenerate */



// https://archinect.com/news/gallery/47637482/11/frank-lloyd-wright-s-lesser-known-contributions-to-graphic-design

function make_gridpoints(n_x, n_y) {

  var xs = [];
  var x = 0;
  while (x < n_x) {
    xs.push(x);
    x += _.random(1, 6) / 6;
  }
  
  var ys = [];
  var y = 0;
  while (y < n_y) {
    ys.push(y);
    y += _.random(2, 12) / 6;
  }
  
  var gridpoints = [];
  _.each(xs, function(x, x_i) {
    _.each(ys, function(y, y_i) {
      var next_x = xs[x_i + 1];
      var next_y = ys[y_i + 1];
      if (next_x === undefined) {
        next_x = n_x;
      }
      if (next_y === undefined) {
        next_y = n_y;
      }
      gridpoints.push({
        x0: x,
        y0: y,
        x1: next_x,
        y1: next_y,
        width: next_x - x,
        height: next_y - y
      });
    });
  });
  return gridpoints;
}

Snap.plugin(function(Snap, Element, Paper, global) {
  Paper.prototype.semicircle = function(cx, cy, r) {
    var p = 'M' + cx + ',' + cy;
    p += 'm' + -r + ',0';
    p += 'a' + r + ',' + r + ' 0 1,0 ' + (r*2) +',0 Z';
    return this.path(p, cx, cy);
  };
});

function regenerate () {
  var SVG_ID = '#canvas';
  var N_X = 5;
  var N_Y = 5;

  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y);
  
  // most simple interpolation in HCL space
  var a = chroma.interpolate('#383D41', '#EFEE69', 0.25, 'hcl').hex();
  var b = chroma.interpolate('#383D41', '#EFEE69', 0.75, 'hcl').hex();
  // returns "#5C9A7C"
  
  // also, you can instantiate HCL colors directly
  var a = chroma.hcl(50, 70, 50).hex();
  var b = chroma.hcl(50, 70, 25).hex();
  var c = chroma.hcl(50, 70, 75).hex();
  var d = chroma.hcl(50, 70, 100).hex();
  var e = chroma.hcl(50, 70, 125).hex();
  
  // returns "#C6A860"
  // s.rect(1, 0, 1, 1).attr({
  //   fill: b,
  //   stroke: 'none'
  // })


  
  var n = 100;
  var size = 0.01;
  var x_power = 1.5;
  var y_power = 1.5;

  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {

      s.rect(x, y, 1, 1).attr({
        fill: c,
      });

      var g = s.g();
      _.each(_.range(n), function (i) {

        var rx = (1 - size) * Math.pow(Math.random(), x_power);
        var ry = (1 - size) * Math.pow(Math.random(), y_power);
        g.add(s.rect(x + rx, y + ry, size, size).attr({
          fill: b,
          stroke: 'none'
        }));

        var rx = (1 - size) * Math.pow(Math.random(), x_power);
        var ry = (1 - size) * Math.pow(Math.random(), y_power);
        g.add(s.rect(x + 1 - size - rx, y + ry, size, size).attr({
          // s.rect(x, y, size, size).attr({
          // fill: 'white',
          fill: a,
          stroke: 'none'
        }));

        var rx = (1 - size) * Math.pow(Math.random(), x_power);
        var ry = (1 - size) * Math.pow(Math.random(), y_power);
        g.add(s.rect(x + 1 - size - rx, y + 1 - size - ry, size, size).attr({
          // s.rect(x, y, size, size).attr({
          // fill: 'white',
          fill: e,
          stroke: 'none'
        }));

        var rx = (1 - size) * Math.pow(Math.random(), x_power);
        var ry = (1 - size) * Math.pow(Math.random(), y_power);
        g.add(s.rect(x + rx, y + 1 - size - ry, size, size).attr({
          // s.rect(x, y, size, size).attr({
          // fill: 'white',
          fill: d,
          stroke: 'none'
        }));
        
      });

      var angle = _.sample([0, 90, 180, 270]);
      g.transform(Snap.format('r{angle},{x_center},{y_center}', {
        angle: angle,
        x_center: x + 0.5,
        y_center: y + 0.5
      }));
      
    });
  });
  

  // _.each(_.range(n), function (i) {

  //   var x = (1 - size) * Math.pow(Math.random(), x_power);
  //   var y = (1 - size) * Math.random();
  //   s.rect(1 + x, y, size, size).attr({
  //     fill: 'white',
  //     stroke: 'none'
  //   })

  //   var x = (1 - size) * Math.pow(Math.random(), x_power);
  //   var y = (1 - size) * Math.random();
  //   s.rect(2 - size - x, y, size, size).attr({
  //     fill: a,
  //     stroke: 'none'
  //   })
    
  // });
  
}
