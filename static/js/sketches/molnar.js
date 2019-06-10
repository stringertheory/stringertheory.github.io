/* license for this code at /license.txt */

/* global _, chroma, Snap, makeSVG */
/* exported regenerate */

function calculateHoleP (holes, x, y) {
  var result = 0;
  _.each(holes, function (hole) {
    var x_hole = hole[0];
    var y_hole = hole[1];
    var r_hole = hole[2];
    var r_squared = Math.pow(x - x_hole, 2) + Math.pow(y - y_hole, 2);
    result += (r_hole / r_squared);
  });
  return result;
}

function regenerate () {

  // var seed = 4697;

  var N_X = 47;
  var N_Y = 47;
  var STROKE_WIDTH = 0.07;
  var N_HOLES = 9;
  var MIN_R = 1;
  var MAX_R = 6;
  // var BACKGROUND_COLOR = Snap.rgb()
  var BACKGROUND_COLOR = chroma.hcl(90, 1, 99);

  var BORDER = 2;

  var s = makeSVG(N_X, N_Y, BORDER);

  s.rect(-BORDER, -BORDER, N_X + 2*BORDER, N_Y + 2*BORDER).attr({
    fill: BACKGROUND_COLOR,
    stroke: 'none'
  });
  
  var holes = [];
  _.each(_.range(N_HOLES), function (dummy) {
    holes.push([
      Math.random() * N_X,
      Math.random() * N_Y,
      MIN_R + (MAX_R - MIN_R) * Math.random()
    ]);
  });

  // var colors = [
  //   Snap.rgb(255, 100, 0),
  //   Snap.rgb(0, 100, 255),
  // ];
  // var textAttributes = {
  //   fill: Snap.rgb(125, 125, 125),
  //   'font-size': 0.6,
  //   'font-family': 'Helvetica Neue',
  //   'text-anchor': 'middle',
  //   'alignment-baseline': 'middle'
  
  // };
  // _.each(_.range(N_Y), function (y) {
  //   s.line(0, y + 0.5, N_X, y + 0.5).attr({
  //     'stroke': colors[y % 2],
  //     'strokeWidth': 0.01
  //   });
  //   s.text(-0.5, y + 0.5, "" + y).attr(textAttributes).attr({
  //     fill: colors[y % 2]
  //   });
  //   s.text(N_X + 0.5, y + 0.5, "" + y).attr(textAttributes).attr({
  //     fill: colors[y % 2]
  //   });
  // });
  // _.each(_.range(N_X), function (x) {
  //   s.line(x + 0.5, 0, x + 0.5, N_Y).attr({
  //     'stroke': colors[x % 2],
  //     'strokeWidth': 0.01
  //   });
  //   s.text(x + 0.5, -0.5, "" + x).attr(textAttributes).attr({
  //     fill: colors[x % 2]
  //   });
  //   s.text(x + 0.5, N_Y + 0.5, "" + x).attr(textAttributes).attr({
  //     fill: colors[x % 2]
  //   });
  // });
  
  // var n_points = 0;
  // var rect_group = s.g();
  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {
      var p = calculateHoleP(holes, x, y);
      // var color = 255 - Math.min(255, 255 * p);
      // var rect = rect_group.add(s.rect(x, y, 1, 1).attr({
      //        stroke: 'none',
      //        fill: Snap.rgb(color, 255, 255),
      //   strokeWidth: 0.01
      // }));
      if (Math.random() > p) {
        s.circle(x + 0.5, y + 0.5, 0.15).attr({
          stroke: 'none',
          fill: 'none'
        });
        // n_points += 1;
        var line = s.line(x - 0.5, y + 0.5, x + 1.5, y + 0.5).attr({
          stroke: Snap.rgb(0, 0, 0),
          strokeWidth: STROKE_WIDTH,
          
        });
        line.transform(Snap.format('r{angle},{x_center},{y_center}', {
          angle: 90 + (Math.random() - 0.5) * 135,
          x_center: x + 0.5,
          y_center: y + 0.5
        }));
      }
    });
  });
  // console.log('n points:', n_points);
}
