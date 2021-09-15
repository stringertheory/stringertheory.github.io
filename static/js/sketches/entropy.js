/* license for this code at /license.txt */

var parameters = make_parameters("parameters", [ {
  name: "n_x",
  start: [ 50 ],
  range: {
    min: 1,
    "50%": 50,
    max: 200
  },
  format: format_int()
}, {
  name: "n_y",
  start: [ 200 ],
  range: {
    min: 1,
    "50%": 200,
    max: 500
  },
  format: format_int()
} ]);

function shuffle(array, n_swaps) {
  var swaps = 0;
  while (swaps < n_swaps) {
    var indexA = _.random(0, array.length - 1);
    var indexB = _.random(0, array.length - 1);
    var valueA = array[indexA];
    array[indexA] = array[indexB];
    array[indexB] = valueA;
    swaps += 1;
  }
}

function regenerate() {
  var N_X = parameters["n_x"].slider.get();
  var N_Y = parameters["n_y"].slider.get();
  var s = makeSVG(N_X, N_Y);
  var colors = [ Snap.rgb(43, 188, 230), Snap.rgb(37, 165, 55), Snap.rgb(230, 52, 18), Snap.rgb(0, 0, 0) ];
  _.each(_.range(N_Y), function(y) {
    var color_indexes = _.map(_.range(N_X), function(x) {
      return x % colors.length;
    });
    shuffle(color_indexes, y / 2 * (N_X / N_Y));
    _.each(color_indexes, function(color_index, x) {
      var q = Math.pow(y / N_Y, 2);
      var p = Math.pow(2 * (x - Math.floor(N_X / 2)) / N_X, 12);
      if (Math.random() > q + p) {
        s.circle(x + .5, y + .5, .5).attr({
          fill: colors[color_index],
          stroke: "none"
        });
      }
    });
  });
}
