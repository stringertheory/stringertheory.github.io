/* license for this code at /license.txt */

var parameters = make_parameters("parameters", [ {
  name: "n_x",
  start: [ 5 ],
  range: {
    min: 1,
    max: 30
  },
  format: format_int()
}, {
  name: "n_y",
  start: [ 5 ],
  range: {
    min: 1,
    max: 30
  },
  format: format_int()
} ]);

function regenerate() {
  var N_X = parameters["n_x"].slider.get();
  var N_Y = parameters["n_y"].slider.get();
  var WHITE = "#ffffff";
  var BORDER = .5;
  var s = makeSVG(N_X, N_Y, BORDER);
  var colors = [ Snap.rgb(43, 188, 230), Snap.rgb(37, 165, 55), WHITE, Snap.rgb(0, 0, 0) ];
  s.rect(-BORDER, -BORDER, N_X + 2 * BORDER, N_Y + 2 * BORDER).attr({
    stroke: "none",
    fill: Snap.rgb(0, 0, 0, .1)
  });
  _.each(_.range(N_X), function(x) {
    _.each(_.range(N_Y), function(y) {
      var group = s.g();
      colors = _.shuffle(colors);
      var back1;
      if (colors[0] == WHITE) {
        back1 = colors[1];
      } else if (colors[1] == WHITE) {
        back1 = colors[0];
      } else if (Math.random() < .5) {
        back1 = colors[0];
      } else {
        back1 = colors[1];
      }
      group.add(s.rect(x + .25, y, .5, .5).attr({
        fill: back1,
        stroke: "none"
      }));
      group.add(s.circle(x + .25, y + .25, .25).attr({
        stroke: "none",
        fill: colors[0]
      }));
      group.add(s.circle(x + .75, y + .25, .25).attr({
        stroke: "none",
        fill: colors[1]
      }));
      var back2;
      if (colors[2] == WHITE) {
        back2 = colors[3];
      } else if (colors[3] == WHITE) {
        back2 = colors[2];
      } else if (Math.random() < .5) {
        back2 = colors[2];
      } else {
        back2 = colors[3];
      }
      group.add(s.rect(x + .25, y + .5, .5, .5).attr({
        fill: back2,
        stroke: "none"
      }));
      group.add(s.circle(x + .25, y + .75, .25).attr({
        stroke: "none",
        fill: colors[2]
      }));
      group.add(s.circle(x + .75, y + .75, .25).attr({
        stroke: "none",
        fill: colors[3]
      }));
      if (Math.random() < .25) {
        group.transform(Snap.format("r{angle},{x_center},{y_center}", {
          angle: 90,
          x_center: x + .5,
          y_center: y + .5
        }));
      }
    });
  });
}
