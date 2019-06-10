/* license for this code at /license.txt */

/* global _, Snap, makeSVG */
/* exported regenerate */

// http://gooddesignisgoodbusiness.tumblr.com/post/81138625150/the-cognitivie-puzzles-ogilvy-campaign-for-ibm

function shuffle (array, n_swaps) {
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

function regenerate () {

  var N_X = 51;
  var N_Y = 301;
  
  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y);
  var colors = [
    Snap.rgb(43, 188, 230),
    Snap.rgb(37, 165, 55),
    Snap.rgb(230, 52, 18),
    Snap.rgb(0, 0, 0)
  ];
  
  // make a series of N_Y polygons with the irregular horizontal lines
  _.each(_.range(N_Y), function (y) {
    var color_indexes = _.map(_.range(N_X), function (x) {
      return x % colors.length;
    });
    shuffle(color_indexes, (y / 2) * (N_X / N_Y));
    _.each(color_indexes, function (color_index, x) {
      var q = Math.pow(y / N_Y, 2);
      var p = Math.pow(2 * (x - Math.floor(N_X / 2)) / N_X, 12);
      if (Math.random() > (q + p)) {
        s.circle(x + 0.5, y + 0.5, 0.5).attr({
          fill: colors[color_index],
          stroke: 'none'
        });
      }
    });
  });
}
