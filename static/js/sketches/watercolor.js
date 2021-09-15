/* license for this code at /license.txt */

var parameters = make_parameters("parameters", [ {
  name: "n_shapes",
  start: [ 5 ],
  range: {
    min: 2,
    max: 20
  },
  format: format_int(),
  metric_name: "n_objects"
}, {
  name: "n_layers",
  start: [ 42 ],
  range: {
    min: 1,
    max: 50
  },
  format: format_int(),
  metric_name: "n_x"
}, {
  name: "n_sides",
  start: [ 7 ],
  range: {
    min: 3,
    max: 30
  },
  format: format_int(),
  metric_name: "n_y"
} ]);

function deform(polygon, nDeform, chunkiness, maskFraction) {
  chunkiness = typeof chunkiness !== "undefined" ? chunkiness : 1.5;
  maskFraction = typeof maskFraction !== "undefined" ? maskFraction : 10;
  var radius = (polygon.bounds.right - polygon.bounds.left) / maskFraction;
  var ux = d3.randomUniform(polygon.bounds.left - radius, polygon.bounds.right + radius);
  var uy = d3.randomUniform(polygon.bounds.bottom - radius, polygon.bounds.top + radius);
  _.each(_.range(nDeform), function(dummy) {
    var curve = polygon.firstCurve;
    _.each(_.range(polygon.curves.length), function(dummy) {
      var second = curve.divideAtTime(.5);
      var fd = d3.randomNormal(0, second.length / chunkiness);
      second.point1.x += fd();
      second.point1.y += fd();
      curve = second.next;
    });
    var circleGroup = new paper.Group();
    _.each(_.range(maskFraction * maskFraction), function(dummy) {
      circleGroup.addChild(new paper.Path.Circle({
        center: [ ux(), uy() ],
        radius: radius
      }));
    });
    var group = new paper.Group(circleGroup, polygon);
    group.clipped = true;
  });
}

function randomColor() {
  var rgb = _.map(chroma.random().rgb(), function(value) {
    return value / 255;
  });
  return new paper.Color(rgb[0], rgb[1], rgb[2]);
}

function regenerate() {
  var canvas = document.getElementById("canvas");
  paper.setup(canvas);
  setSeed();
  var nLayers = parameters["n_layers"].slider.get();
  var nSides = parameters["n_sides"].slider.get();
  var opacity = 1 / (nLayers + 1);
  var blend = "lighten";
  var nPoints = parameters["n_shapes"].slider.get();
  var hiddenRadius = 125;
  var pointList = _.map(_.range(nPoints), function(i) {
    var angle = i * (2 * Math.PI / nPoints);
    var r = 2 * Math.PI * hiddenRadius;
    return new paper.Point(.25 * r * (1 + (Math.random() - .5)) * Math.cos(angle) + 0, .25 * r * (1 + (Math.random() - .5)) * Math.sin(angle) + 0);
  });
  var basePolygons = _.map(pointList, function(offset) {
    var multiplier = 1 + (nPoints - 2) / 15;
    var radius = multiplier * 2 * hiddenRadius * Math.sin(Math.PI / nPoints);
    var result = new paper.Path.RegularPolygon({
      center: paper.view.center.add(offset),
      sides: nSides,
      radius: radius,
      opacity: opacity,
      blendMode: blend,
      fillColor: randomColor()
    });
    deform(result, 1, 1.5, .25);
    return result;
  });
  _.each(_.range(nLayers * basePolygons.length), function(index) {
    var i = index % basePolygons.length;
    deform(basePolygons[i].clone(), 4, 1.5, 5);
  });
  paper.view.draw();
}
