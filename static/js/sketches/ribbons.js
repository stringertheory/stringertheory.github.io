

// http://gooddesignisgoodbusiness.tumblr.com/post/81138717065/the-cognitivie-puzzles-ogilvy-campaign-for-ibm

function regenerate () {
  var SVG_ID = '#canvas'
  var N_X = 11
  var N_Y = 11
  var DELTA = 0.1
  var N_LINES = 5
  var P_CIRCLE = 0.2
  
  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y)

  // s.rect(-1, -1, N_X + 2, N_Y + 2).attr({
  //   stroke: 'none',
  //   fill: Snap.rgb(128, 128, 128)
  // })
  
  // make a series of N_Y polygons with the irregular horizontal lines
  _.each(_.range(N_Y), function (y) {
    var cy = y;
    _.each(_.range(N_LINES), function (dy) {
      y = cy + dy * 2 * DELTA
      if (Math.random() < 0.25) {
        var color = Snap.rgb(0, 150, 214)
        if (Math.random() < 0.5) {
          color = Snap.rgb(227, 6, 19)
        }
        var transition_point = _.random(0, N_X - 3)
        var sign = _.sample([-1, 1]);
        var h = 2;
        var line = [
          [0, y],
          [transition_point, y],
          [transition_point + h, y + sign * h],
          [N_X, y + sign * h],
          [N_X, y + sign * h - sign * DELTA],
          [transition_point + h + 1, y + sign * h - sign * DELTA],
          [transition_point + 1, y - sign * DELTA],
          [0, y - sign * DELTA]
        ];
        s.polyline(line).attr({
          stroke: 'none',
          fill: color,
          style: 'mix-blend-mode: darken'
        })
      }
    })     
  })

  _.each(_.range(1, N_Y), function (y) {
    _.each(_.range(1, N_X), function (x) {
      if (Math.random() < P_CIRCLE) {
	s.circle(x + 0.5 * (Math.random() - 0.5), y + 0.5 * (Math.random() - 0.5), 0.25).attr({
	  stroke: 'red',
	  strokeWidth: 0,
	  fill: 'black'
	})
      }
    })
  })
}
