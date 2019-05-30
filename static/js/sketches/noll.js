

function regenerate () {
  var SVG_ID = '#canvas'
  var N_X = 42
  var N_Y = 42
  var STROKE_WIDTH = 0.4
  var P_VERTICAL = 0.3
  var P_DRAW = 0.2
  var GRID_JITTER = 0.5

  var s = makeSVG(N_X, N_Y)

  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {
      var r_squared = Math.pow((N_X / 2 - x), 2) + Math.pow((N_Y / 2 - y), 2)
      if (Math.sqrt(r_squared) <= N_X / 2 && Math.random() < P_DRAW) {
	var l = s.line(x, y, x + 1 + 2 * Math.random(), y).attr({
	  stroke: 'black',
	  strokeWidth: STROKE_WIDTH
	})
	l.transform(
	  Snap.format('t{x},{y}', {
            x: GRID_JITTER * Math.random(),
            y: GRID_JITTER * Math.random()
	  })
	)
	if (Math.random() < P_VERTICAL) {
	  l.transform(Snap.format('r{angle},{x_center},{y_center}', {
            angle: 90,
            x_center: x,
            y_center: y
	  }))
	}
      }
    })
  })
}
