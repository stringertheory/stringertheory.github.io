/* license for this code at /license.txt */

/* global _, makeSVG */
/* exported regenerate */

function regenerate() {

  var N_X = 12;
  var N_Y = 12;
  var STROKE_COLOR = 'black';
  var STROKE_WIDTH = 0.02;
  var CIRCLE_STROKE_COLOR = 'none';
  var CIRCLE_STROKE_WIDTH = 0.02;
  var P_CRISSCROSS = 0.15;
  var P_VERTICAL = 0.05;
  var P_CIRCLE = 0.1;

  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y);

  // for the mask
  var outer = s.rect(0, 0, N_X, N_Y).attr({
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    fill: 'white'
  });

  // to draw the border
  s.rect(0, 0, N_X, N_Y).attr({
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    fill: 'none'
  });

  // make a series of N_Y polygons with the irregular horizontal lines
  var current_top = [[0, 0], [N_X, 0]];
  var group = s.g();
  _.each(_.range(1, N_Y), function (y) {
    var current_x = 0;
    var current_y = y + 0.4 * (Math.random() - 0.5);
    var current_bottom = [[current_x, current_y]];
    _.each(_.range(N_Y), function (dummy) {
      current_x += 1 + Math.random();
      current_y += 0.4 * (Math.random() - 0.5);
      current_bottom.push([current_x, current_y]);
    });
    var next_top = current_bottom.slice(0);
    current_bottom.reverse();
    group.add(s.polyline(current_top.concat(current_bottom)).attr({
      stroke: STROKE_COLOR,
      strokeWidth: STROKE_WIDTH,
      fill: 'white'
    }));
    current_top = next_top;
  });
  var current_bottom = [[0, N_Y], [N_X, N_Y]];
  current_bottom.reverse();
  group.add(s.polyline(current_top.concat(current_bottom)).attr({
    stroke: STROKE_COLOR,
    strokeWidth: STROKE_WIDTH,
    fill: 'white'
  }));

  // mask the polygons with the border
  group.attr({mask: outer});

  // now clone the group of polygons so that the polygon borders show up
  group.clone();

  // go through a grid of N_X x N_Y
  _.each(_.range(N_Y), function (y) {
    // get the min and max y value for the polygon
    var bbox = group[y].getBBox();

    // make groups of either criss-crossy or vertical lines at each grid
    // position
    var v_group = s.g();
    _.each(_.range(N_X), function (x) {
      if (Math.random() < P_CRISSCROSS) {
        _.each(_.range(20), function (dummy) {
          v_group.add(s.line(
            x + Math.random(), bbox.y,
            x + Math.random(), bbox.y2
          ).attr({
            stroke: STROKE_COLOR,
            strokeWidth: STROKE_WIDTH
          }));
        });
      } else if (Math.random() < P_VERTICAL) {
        _.each(_.range(20), function (dummy) {
          var x0 = x + Math.random();
          v_group.add(s.line(x0, bbox.y, x0, bbox.y2).attr({
            stroke: STROKE_COLOR,
            strokeWidth: STROKE_WIDTH
          }));
        });
      }
    });
    v_group.attr({mask: group[y]});
  });
  
  _.each(_.range(1, N_Y), function (y) {
    _.each(_.range(1, N_X), function (x) {
      if (Math.random() < P_CIRCLE) {
        s.circle(x, y, Math.random()).attr({
          strokeWidth: CIRCLE_STROKE_WIDTH,
          stroke: CIRCLE_STROKE_COLOR,
          fill: 'none'
        });
      }
    });
  });
}
