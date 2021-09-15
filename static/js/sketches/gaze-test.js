/* license for this code at /license.txt */

function Queue(max_size) {
  this.x = [];
  this.y = [];
  this.max_size = max_size;
}

Queue.prototype.push = function(value) {
  this.x.unshift(value.x);
  if (this.x.length > this.max_size) {
    this.x.pop();
  }
  this.y.unshift(value.y);
  if (this.y.length > this.max_size) {
    this.y.pop();
  }
};

Queue.prototype.mean = function(value) {
  var x_sum = this.x.reduce((a, b) => a + b, 0);
  var y_sum = this.y.reduce((a, b) => a + b, 0);
  var n = this.x.length;
  return {
    x: x_sum / n,
    y: y_sum / n
  };
};

function regenerate() {
  var q = new Queue(60);
  var N_X = window.innerWidth;
  var N_Y = window.innerHeight;
  var BORDER = .5;
  var s = makeSVG(N_X, N_Y, BORDER);
  var bgColor = chroma.rgb(250, 247, 244);
  s.rect(-BORDER, -BORDER, N_X + 2 * BORDER, N_Y + 2 * BORDER).attr({
    stroke: "none",
    fill: bgColor.hex()
  });
  webgazer.setGazeListener(function(data, elapsedTime) {
    if (data == null) {
      return;
    }
    webgazer.util.bound(data);
    q.push(data);
    var smooth = q.mean();
    s.circle(smooth.x, smooth.y, 50).attr({
      stroke: "none",
      fill: "black",
      fillOpacity: .01
    });
  }).begin();
}
