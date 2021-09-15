/* license for this code at /license.txt */

function setSeed() {
  var seed = Qs.parse(window.location.hash)["#seed"];
  if (seed) {
    Math.seedrandom(seed);
  } else {
    Math.seedrandom();
  }
}

function makeSVG(n_x, n_y, border = 0) {
  var WIDTH = "100%";
  setSeed();
  var s = Snap("#canvas");
  s.clear();
  s.attr({
    width: WIDTH,
    viewBox: Snap.format("{min_x} {min_y} {width} {height}", {
      min_x: -border,
      min_y: -border,
      width: n_x + 2 * border,
      height: n_y + 2 * border
    })
  });
  var g = s.group();
  return g;
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(",")[1]);
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  var blob = new Blob([ ab ], {
    type: mimeString
  });
  return blob;
}

function download_svg(svg) {
  svg.toDataURL("image/png", {
    callback: function(data) {
      var image = data.replace("image/png", "image/octet-stream");
      var hash_pre = md5(image);
      var hash = hash_pre.substring(0, 6);
      var filename = window.location.pathname + window.location.hash + "-" + hash;
      var png_filename = filename + ".png";
      var svg_filename = filename + ".svg";
      var blob = dataURItoBlob(image);
      var blobUrl = URL.createObjectURL(blob);
      download_as_file(png_filename, blobUrl);
      var svgString = new XMLSerializer().serializeToString(svg);
      var svgUrl = "data:text/plain;charset=utf-8,";
      svgUrl += encodeURIComponent(svgString);
      download_as_file(svg_filename, svgUrl);
    }
  });
}

function download(element_id = "#canvas") {
  if (element_id[0] === "#") {
    element_id = element_id.split("#")[1];
  }
  var element = document.getElementById(element_id);
  if (element.nodeName == "svg") {
    download_svg(element);
  } else if (element.nodeName == "CANVAS") {
    download_canvas(element);
  } else {
    console.error("unknown element", element.nodeName);
  }
}

function download_canvas(canvas) {
  var hash_pre = md5(canvas);
  var hash = hash_pre.substring(0, 6);
  var filename = window.location.pathname + window.location.hash + "-" + hash;
  var png_filename = filename + ".png";
  download_as_file(png_filename, canvas.toDataURL());
}

function download_as_file(filename, url) {
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  a.remove();
}

function jitter(amount) {
  return amount * (Math.random() - .5);
}

function convertToPath(points) {
  var path = "";
  _.each(points, function(point, index) {
    var x = point[0];
    var y = point[1];
    if (index === 0) {
      path += "M" + x + "," + y + " R";
    } else if (index === points.length - 1) {
      path += x + "," + y;
    } else {
      path += x + "," + y + ",";
    }
  });
  return path;
}

function makeid(length) {
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  characters += "abcdefghijklmnopqrstuvwxyz";
  characters += "0123456789";
  var charactersLength = characters.length;
  var seed = "";
  for (var i = 0; i < length; i++) {
    seed += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  var components = {
    seed: seed
  };
  if (typeof parameters !== "undefined") {
    _.each(_.keys(parameters), function(key) {
      components[key] = parameters[key].slider.get();
    });
  }
  return Qs.stringify(components);
}

function compliment(color, angle, lightness) {
  if (angle === undefined) {
    angle = 180;
  }
  if (lightness === undefined) {
    lightness = 1;
  }
  var h = color.hcl()[0] + angle;
  var c = color.hcl()[1];
  var l = color.hcl()[2] * lightness;
  return chroma.hcl(h, c, l);
}

function make_parameters(div_id, parameter_list) {
  var parent_div = document.getElementById(div_id);
  var result = {};
  var query_params = Qs.parse(window.location.hash);
  _.each(parameter_list, function(conf) {
    var name = conf.name;
    if (name in query_params) {
      conf["start"] = [ query_params[name] ];
    }
    var parameter_div = document.createElement("div");
    parameter_div.classList.add("parameter");
    var slider = document.createElement("div");
    slider.id = "slider-" + name;
    slider.classList.add("parameter-slider");
    slider.setAttribute("data-name", name.replace(/_/g, " "));
    parameter_div.appendChild(slider);
    var sliderValue = document.createElement("input");
    sliderValue.id = "slider-" + name + "-value";
    sliderValue.classList.add("parameter-input");
    parameter_div.appendChild(sliderValue);
    parent_div.appendChild(parameter_div);
    noUiSlider.create(slider, conf);
    slider.noUiSlider.on("update", function(values, handle) {
      sliderValue.value = values[handle];
    });
    sliderValue.addEventListener("change", function() {
      slider.noUiSlider.set(this.value);
    });
    var metric_name = conf.metric_name || conf.name;
    result[name] = {
      slider: slider.noUiSlider,
      metric_name: metric_name
    };
  });
  return result;
}

function format_int() {
  return {
    to: function(value) {
      return parseInt(value);
    },
    from: function(value) {
      return parseInt(value);
    }
  };
}

function format_decimal() {
  return {
    to: function(value) {
      return new Number(value).toFixed(3);
    },
    from: function(value) {
      return new Number(value).toFixed(3);
    }
  };
}
