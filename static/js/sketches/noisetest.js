/* license for this code at /license.txt */

/* global _, chroma, Snap, makeSVG, make_parameters, jitter,
   format_int, noise */
/* exported regenerate */

var parameters = make_parameters('parameters', [
  {
    name: 'n_x',
    start: [1],
    range: {'min': 1, 'max': 30},
    format: format_int()
  }, {
    name: 'n_y',
    start: [1],
    range: {'min': 1, 'max': 30},
    format: format_int()
  }
]);

// TODO:
// randomize mouth shape (slight smile versus straight) X
// randomize mouth rotation (can be slightly askew) X
// randomize mouth center (can be slightly offcenter) X
// randomize size of eyes NO
// randomize distance-apart of eyes X
// randomize head-height of eyes X
// randomize width of character
// randomize length of legs
// randomize number of legs (2 or 4)
// randomize angular placement of legs (can be slightly rotated)



function blob(x_center, y_center, r_base, n_points) {
  var jitter = 0.07;
  noise.seed(Math.random());
  var x_squish = 1;//1 - 0.5 * Math.random()
  var y_squish = 1;//1 - 0.5 * Math.random()
  var points = [];
  _.each(_.range(n_points), function (i) {
    var theta = 2 * Math.PI * i / n_points;
    var r = r_base + jitter * noise.perlin2(Math.cos(theta), Math.sin(theta));
    var x = x_squish * r * Math.cos(theta);
    var y = y_squish * r * Math.sin(theta);
    points.push([x_center + x, y_center + y]);
  });
  points.push([points[0][0], points[0][1]]);
  return points;  
}

function mouthline(x0, y0, width, height, n_points, jitter) {
  noise.seed(Math.random());
  var points = [];
  _.each(_.range(n_points), function (i) {
    var x = x0 + width * (i / (n_points - 1));
    var a = - 4 * height / (width * width);
    var y = a * Math.pow(x - (x0 + 0.5 * width), 2) + (y0 + height) + jitter * noise.perlin2(x, y0);
    points.push([x, y]);
  });
  return points;  
}

function regenerate() {

  var N_X = parameters['n_x'].get();
  var N_Y = parameters['n_y'].get();
  var N_POINTS = 36 * 2;
  var STROKE_WIDTH = 0.03;
  var STROKE_COLOR = 'black';
  var BACKGROUND_COLOR = 'white';
  var EPSILON = 0.000001;
  
  var s = makeSVG(N_X, N_Y);

  s.rect(0, 0, N_X, N_Y).attr({
    stroke: 'none',
    fill: BACKGROUND_COLOR
  });
  
  _.each(_.range(N_X), function (x) {
    _.each(_.range(N_Y), function (y) {

      var cx = x + 0.5;
      var cy = y + 0.5;

      var group = s.g();
      
      var points = blob(cx, cy, 0.4, N_POINTS);
      var face = s.polyline(points).attr({
        stroke: STROKE_COLOR,
        fill: chroma.mix(chroma.random(), 'white', 0.5),
        strokeWidth: STROKE_WIDTH
        // 'vector-effect': "non-scaling-stroke"
      });
      group.add(face);

      var mouth_jitter = 0.07;
      var mouth_width = 0.9;
      var max_smile = 0.1;
      points = mouthline(
        x + 0.5 * (1 - mouth_width) + jitter(mouth_jitter),
        cy + jitter(mouth_jitter),
        mouth_width + jitter(mouth_jitter),
        max_smile * Math.random(),
        N_POINTS,
        mouth_jitter
      );
      var mouth = s.polyline(points).attr({
        stroke: STROKE_COLOR,
        fill: 'none',
        strokeWidth: STROKE_WIDTH
        // 'vector-effect': "non-scaling-stroke"
      });
      mouth.transform(Snap.format('r{angle},{x_center},{y_center}', {
        angle: -10 + 20 * Math.random(),
        x_center: cx,
        y_center: cy
      }));
      group.add(mouth);
      
      var n_legs = 2;
      _.each(_.range(n_legs), function (i) {
        var theta = Math.PI / 2 - 15 * Math.PI / 180 + 30 * i * Math.PI / 180;
        var points = [
          [cx + 0.35 * Math.cos(theta) + jitter(0.05),
           cy + 0.35 * Math.sin(theta) + jitter(0.05)],
          [cx + 0.5 * Math.cos(theta) + jitter(0.05),
           cy + 0.5 * Math.sin(theta) + jitter(0.05)],
        ];
        var leg = s.polyline(points).attr({
          stroke: STROKE_COLOR,
          fill: 'none',
          strokeWidth: STROKE_WIDTH
          // 'vector-effect': "non-scaling-stroke"
        });
        group.add(leg);
      });

      var n_eyes = 2;
      var eye_apart = (30 + 60 * Math.random()) * Math.PI / 180;
      var eye_center = (270 + 30 * (Math.random() - 0.5)) * Math.PI / 180;
      _.each(_.range(n_eyes), function (i) {
        var theta = eye_center - eye_apart * (i - 0.5);
        var eye_r = 0.15 + 0.05 * Math.random();
        var x_eye = eye_r * Math.cos(theta);
        var y_eye = eye_r * Math.sin(theta);
        var eye = s.line(
          cx + x_eye, cy + y_eye,
          cx + x_eye, cy + y_eye + EPSILON).attr({
            // fill: chroma.mix(chroma.random(), 'black', 1),
            // 'vector-effect': "non-scaling-stroke",
            'stroke': chroma.mix(chroma.random(), STROKE_COLOR, 1),
            'strokeWidth': 2 * STROKE_WIDTH,
            'stroke-linecap': 'round'
          });
        // var eye_size = 0.03;
        // var eye = s.circle(cx + x_eye, cy + y_eye, eye_size).attr({
        //   stroke: 'none',
        //   fill: chroma.mix(chroma.random(), 'black', 1),
        //   strokeWidth: STROKE_WIDTH,
        //   'vector-effect': "non-scaling-stroke",
        // })
        group.add(eye);
      });
      group.transform(Snap.format('s{x},{y}', {
        x: 1.0 - 0.25 * Math.random(),
        y: 1.0 - 0.25 * Math.random()
      }));
        
        // p.transform(Snap.format('r{angle},{x_center},{y_center}', {
      //        angle: Math.random() * 360,
      //        x_center: cx,
      //        y_center: cy
      // }))
    });
      
  });
    
  
}
