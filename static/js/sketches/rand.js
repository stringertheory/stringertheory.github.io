function randomColor() {
  var h = 360 * Math.random()
  var s = 0.5 * 100
  var l = 0.6 * 100
  return chroma.hcl(h, s, l).hex()
}

// http://www.wassilykandinsky.net/work-247.php
function regenerate () {
  var SVG_ID = '#canvas'
  var N_X = 40
  var N_Y = N_X * 1.33 //(Math.sqrt(5) + 1) / 2
  var DELTA = 0.1
  var N_LINES = 5
  var P_CIRCLE = 0.2
  
  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y)

  var bgColor = Snap.rgb(25, 25, 25)
  s.rect(-1, -1, N_X + 2, N_Y + 2).attr({
    stroke: 'none',
    fill: bgColor
  })

  var textGroup = s.g()
  var text = 'Hello World'
  var textAttributes = {
    fill: Snap.rgb(230, 230, 230),
    'font-size': 1,
    'font-family': 'Helvetica Neue',
    'font-weight': 'light'
    
  }
  var xText = 1 + 12 * Math.random()
  var yText = N_Y - 10 - (N_Y - 10 - 12) * Math.random()
  textGroup.add(s.text(xText, yText, text).attr(textAttributes).attr({
    'font-weight': '900'
  }))
  var text = 'Special Issue'
  textGroup.add(s.text(xText + 7, yText, text).attr(textAttributes))
  var text = '30 Influential Humans'
  yText += 1.4
  textGroup.add(s.text(xText + 8, yText, text).attr(textAttributes))
  var text = 'of the Century'
  yText += 1.4
  textGroup.add(s.text(xText + 6, yText, text).attr(textAttributes))
  var maxRadius = 2
  var textBBox = textGroup.getBBox()
  var textBacker = s.rect(textBBox.x - 2 * maxRadius, textBBox.y - 2 * maxRadius, textBBox.width + 4 * maxRadius, textBBox.height + 4 * maxRadius).attr({
    fill: 'none',
    stroke: 'none',
    strokeWidth: 0.5
  })
  var backerBBox = textBacker.getBBox()

        // textGroup.transform(
        //   Snap.format('r{angle},{x_center},{y_center}', {
        //     angle: 90,
        //     x_center: N_X / 2,
        //     y_center: N_Y / 2
        //   })
        // )
  
  var sigPoints = []
  var charX = N_X - 6
  var charY = N_Y - 2
  _.each(_.range(5), function () {
    _.each(_.range(5), function () {
      var x = charX + Math.random()
      var y = charY + Math.random()
      sigPoints.push([x, y])
    })
    charX += 1
  })
  var path = convertToPath(sigPoints)
  var sig = s.path(path).attr({
      fill: 'none',
      stroke: 'white',
      strokeWidth: 0.05
    })
  
  var total_area = N_X * N_Y
  var circle_area = 0
  var N_CIRCLES = 21
  var n_circles = 0
  while (n_circles < N_CIRCLES) {
    var color = randomColor()
    var x = maxRadius + (N_X - 2 * maxRadius) * Math.random()
    var y = maxRadius + (N_Y - 2 * maxRadius) * Math.random()
    var r = maxRadius
    if (!Snap.path.isPointInsideBBox(backerBBox, x, y)) {
      s.circle(x, y, r).attr({
        stroke: 'none',
        fill: color,
        style: 'mix-blend-mode: lighten'
      })
      n_circles += 1
    }
  }

  
}
