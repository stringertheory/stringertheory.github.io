/* license for this code at /license.txt */

SVGElement.prototype.toDataURL = function(type, options) {
  var _svg = this;
  var _image_width = 1200;
  function debug(s) {
    console.log("SVG.toDataURL:", s);
  }
  function exportSVG() {
    var svg_xml = XMLSerialize(_svg);
    var svg_dataurl = base64dataURLencode(svg_xml);
    debug(type + " length: " + svg_dataurl.length);
    if (options.callback) options.callback(svg_dataurl);
    return svg_dataurl;
  }
  function XMLSerialize(svg) {
    function XMLSerializerForIE(s) {
      var out = "";
      out += "<" + s.nodeName;
      for (var n = 0; n < s.attributes.length; n++) {
        out += " " + s.attributes[n].name + "=" + "'" + s.attributes[n].value + "'";
      }
      if (s.hasChildNodes()) {
        out += ">\n";
        for (var n = 0; n < s.childNodes.length; n++) {
          out += XMLSerializerForIE(s.childNodes[n]);
        }
        out += "</" + s.nodeName + ">" + "\n";
      } else out += " />\n";
      return out;
    }
    if (window.XMLSerializer) {
      debug("using standard XMLSerializer.serializeToString");
      return new XMLSerializer().serializeToString(svg);
    } else {
      debug("using custom XMLSerializerForIE");
      return XMLSerializerForIE(svg);
    }
  }
  function base64dataURLencode(s) {
    var b64 = "data:image/svg+xml;base64,";
    if (window.btoa) {
      debug("using window.btoa for base64 encoding");
      b64 += btoa(s);
    } else {
      debug("using custom base64 encoder");
      b64 += Base64.encode(s);
    }
    return b64;
  }
  function exportImage(type) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var svg_img = new Image();
    var svg_xml = XMLSerialize(_svg);
    svg_img.src = base64dataURLencode(svg_xml);
    svg_img.onload = function() {
      debug("exported image size: " + [ svg_img.width, svg_img.height ]);
      canvas.width = _image_width;
      canvas.height = _image_width * (svg_img.height / svg_img.width);
      ctx.drawImage(svg_img, 0, 0);
      var png_dataurl = canvas.toDataURL(type);
      debug(type + " length: " + png_dataurl.length);
      if (options.callback) options.callback(png_dataurl); else debug("WARNING: no callback set, so nothing happens.");
    };
    svg_img.onerror = function() {
      console.log("Can't export! Maybe your browser doesn't support " + "SVG in img element or SVG input for Canvas drawImage?\n" + "http://en.wikipedia.org/wiki/SVG#Native_support");
    };
  }
  function exportImageCanvg(type) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    var svg_xml = XMLSerialize(_svg);
    var keepBB = options.keepOutsideViewport;
    if (keepBB) var bb = _svg.getBBox();
    canvg(canvas, svg_xml, {
      ignoreMouse: true,
      ignoreAnimation: true,
      offsetX: keepBB ? -bb.x : undefined,
      offsetY: keepBB ? -bb.y : undefined,
      scaleWidth: keepBB ? bb.width + bb.x : undefined,
      scaleHeight: keepBB ? bb.height + bb.y : undefined,
      renderCallback: function() {
        debug("exported image dimensions " + [ canvas.width, canvas.height ]);
        var png_dataurl = canvas.toDataURL(type);
        debug(type + " length: " + png_dataurl.length);
        if (options.callback) options.callback(png_dataurl);
      }
    });
    return canvas.toDataURL(type);
  }
  if (!type) type = "image/svg+xml";
  if (!options) options = {};
  if (options.keepNonSafe) debug("NOTE: keepNonSafe is NOT supported and will be ignored!");
  if (options.keepOutsideViewport) debug("NOTE: keepOutsideViewport is only supported with canvg exporter.");
  switch (type) {
   case "image/svg+xml":
    return exportSVG();
    break;

   case "image/png":
   case "image/jpeg":
    if (!options.renderer) {
      if (window.canvg) options.renderer = "canvg"; else options.renderer = "native";
    }
    switch (options.renderer) {
     case "canvg":
      debug("using canvg renderer for png export");
      return exportImageCanvg(type);
      break;

     case "native":
      debug("using native renderer for png export. THIS MIGHT FAIL.");
      return exportImage(type);
      break;

     default:
      debug("unknown png renderer given, doing noting (" + options.renderer + ")");
    }
    break;

   default:
    debug("Sorry! Exporting as '" + type + "' is not supported!");
  }
};
