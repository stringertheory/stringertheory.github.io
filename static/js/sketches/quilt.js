

// http://simoncpage.co.uk/blog/2009/08/random-dance-geometric-poster-designs/
// http://www.pbase.com/brownsf/amish_quilts
// http://www.pbase.com/brownsf/image/84992170
// http://www.pbase.com/brownsf/image/12150606
function rando() {
  var h = 360 * Math.random();
  var c = 80 + 20 * Math.random()
  var l = 80 + 20 * Math.random()
  return chroma.hcl(h, c, l)
}

function regenerate () {
  var SVG_ID = '#canvas'
  var N_X = 9
  var N_Y = 9
  
  // make an svg with a viewbox
  var s = makeSVG(N_X, N_Y)

  var color1 = rando()
  // var color1 = chroma.random()
  // var color2 = chroma.random()
  var colors = [
    color1.hex(),
    compliment(color1, 180),
    // compliment(color1, 240),
    // color2.hex(),
    // compliment(color2, 120),
    // compliment(color2, 240)
  ]
  // var colors = [
  //   chroma.blend('0000ff', '0000aa', 'multiply').hex(),
  //   chroma.blend('red', 'blue', 'darken').hex()
  // ]
  // var colors = _.map(_.range(3), function (i) {
  //   return chroma.random().hex()
  // })
  // var colors = chroma.scale([chroma.random(), chroma.random()]).colors(7)
  // var colors = [
  //   Snap.rgb(43, 188, 230),
  //   Snap.rgb(37, 165, 55),
  //   Snap.rgb(220, 220, 220),
  //   Snap.rgb(0, 0, 0),
  //   Snap.rgb(43, 188, 230),
  //   Snap.rgb(37, 165, 55),
  //   Snap.rgb(220, 220, 220),
  //   Snap.rgb(0, 0, 0),
  //   Snap.rgb(43, 188, 230),
  //   Snap.rgb(37, 165, 55),
  //   Snap.rgb(220, 220, 220),
  //   Snap.rgb(0, 0, 0),
  //   Snap.rgb(43, 188, 230),
  //   Snap.rgb(37, 165, 55),
  //   Snap.rgb(220, 220, 220),
  //   Snap.rgb(0, 0, 0),
  //   Snap.rgb(43, 188, 230),
  //   Snap.rgb(37, 165, 55),
  //   Snap.rgb(200, 200, 200),
  //   Snap.rgb(0, 0, 0)    
  // ]
  
  var stroker = colors[0]

  var grid = []
  _.each(_.range(N_X + 1), function (x) {
    var row = []
    _.each(_.range(N_Y + 1), function (y) {
      if (x > 0 && y > 0 && x < N_X && y < N_Y) {
        row.push([x + jitter(0.5), y + jitter(0.5)])
      } else {
        row.push([x, y])
      }
    })
      grid.push(row)
  })
  
  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {

      colors = _.shuffle(colors)
      
      var group = s.g()
      
      _.each(colors, function (color, index) {
        var height = 2 * (colors.length - index) / colors.length
        group.add(s.rect(x - 0.5, y - 0.5, 2, height).attr({
          fill: color,
          stroke: 'none',
          strokeWidth: 0.02
        }))
      })
      var path = [
        grid[x][y],
        grid[x + 1][y],
        grid[x + 1][y + 1],
        grid[x][y + 1]
      ]
      var clipper = s.polyline(path)
      // var blipper = s.polyline(path).attr({
      //   fill: 'none',
      //   stroke: stroker,
      //   strokeWidth: 0.05
      // })
      if (Math.random() < 1) {
        var angle = 360 * (Math.random() - 0.5)
        group.transform(
          Snap.format('r{angle},{x_center},{y_center}', {
            angle: angle,
            x_center: x + 0.5,
            y_center: y + 0.5
          })
        )
        clipper.transform(
          Snap.format('r{angle},{x_center},{y_center}', {
            angle: -angle,
            x_center: x + 0.5,
            y_center: y + 0.5
          })
        )
      }
      group.attr({
        clip: clipper
      })
    })
  })
}
