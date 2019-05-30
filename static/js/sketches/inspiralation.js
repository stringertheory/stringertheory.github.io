

function regenerate () {
  var SVG_ID = '#canvas'
  var N_X = 50
  var N_Y = 50
  
  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y)

  // var N_ELLIPSES = 200
  // var a = 3
  // var b = 4
  // var delta = Math.PI / 4
  // var dx = 0
  // var dy = 0
  // var rx = 5
  // var ry = 20
  // var amount = 1;
  // var angle = 0;
  // _.each(_.range(N_ELLIPSES), function (i) {
  //   t = 2 * i * Math.PI / N_ELLIPSES
  //   x = t * N_X / (2 * Math.PI)
  //   // x = N_X / 2 + N_X / 3 * Math.sin(a * t + delta) + dx
  //   y = N_Y / 2 + N_Y / 3 * Math.sin(b * t) + dy
  //   dx += 0//jitter(amount)
  //   dy += 0//jitter(amount)
  //   rx += 0//jitter(amount)
  //   ry += 0//jitter(amount)
  //   angle += jitter(2)
  //   var e = s.ellipse(x, y, rx, ry).attr({
  //     stroke: 'black',
  //     fill: 'none',
  //     strokeWidth: 0.25,
  //     strokeOpacity: 0.25
  //   })
  //   e.transform(
  //     Snap.format('r{angle},{x_center},{y_center}', {
  //       angle: angle,
  //       x_center: x,
  //       y_center: y
  //     })
  //   )
  // })

  var N_ELLIPSES = N_X * 2
  var amount = 1;
  var angle = 0;
  _.each(_.range(N_ELLIPSES), function (i) {
    var x = N_X / 2 - 0.5
    var y = N_Y / 2
    var rx = i / 2.2 + jitter(0.1)
    var ry = i / 2 + jitter(0.1)
    angle += jitter(2)
    var e = s.ellipse(x, y, rx, ry).attr({
      stroke: 'blue',
      fill: 'none',
      strokeWidth: 0.1,
      strokeOpacity: 1,
    })
    e.transform(
      Snap.format('r{angle},{x_center},{y_center}', {
        angle: angle,
        x_center: x,
        y_center: y
      })
    )
  })
  var N_ELLIPSES = N_X * 2
  var amount = 1;
  var angle = 0;
  _.each(_.range(N_ELLIPSES), function (i) {
    var x = N_X / 2 + 0.5 + jitter(0.1)
    var y = N_Y / 2 + jitter(0.1)
    var rx = i / 2 + jitter(0.05)
    var ry = i / 2.2 + jitter(0.05)
    angle += jitter(2)
    var e = s.ellipse(x, y, rx, ry).attr({
      stroke: 'red',
      fill: 'none',
      strokeWidth: 0.1,
      strokeOpacity: 1,
    })
    e.transform(
      Snap.format('r{angle},{x_center},{y_center}', {
        angle: angle,
        x_center: x,
        y_center: y
      })
    )
  })
    
}
