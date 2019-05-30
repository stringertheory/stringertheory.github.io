function createLine(x1,y1, x2,y2, klass){
  var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
  var angle  = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  var transform = 'rotate('+angle+'deg)';
  
  var line = $('<div>')
      .appendTo('div.page')
      .addClass('line')
      .addClass(klass)
      .fadeIn(200)
      .css({
        'position': 'absolute',
        'transform': transform
      })
      .width(length)
      .offset({left: x1, top: y1})
  
  return line;
}

function box(element) {
  var offset = element.offset();
  var top = offset.top;
  var left = offset.left;
  var bottom = top + element.outerHeight();
  var right = left + element.outerWidth();
  return {
    top: top,
    left: left,
    bottom: bottom,
    right: right
  };
}

$(document).ready(function () {
  var lines = [];
  $('a#a-1').hover(function (event) {
    var span = $('span#a-1');
    span.offset({top: $(this).offset().top})
    span.css({
      position: "absolute",
      top: $(this).offset().top - 0.5 * span.height() + 0.5 * $(this).height()
    }).fadeIn(200);
    if (span.is(":visible")) {
      var a_box = box($(this));
      var span_box = box(span);
      var gutter_box = box($('div.big-gutter'));
      var mid = (gutter_box.left + 30);
      var horizontal_line = createLine(a_box.right - 1, a_box.bottom - 1, mid + 1, a_box.bottom - 1, 'horizontal');
      var diagonal_line = createLine(mid, a_box.bottom - 1, span_box.left, span_box.bottom - 2, 'diagonal');
    }
    event.stopPropagation();
  }, function (event) {
    $('span#a-1').fadeOut(200);
    $('.line').fadeOut(200);
  })
});
