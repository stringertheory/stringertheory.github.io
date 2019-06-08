
function setSeed() {
  // explicitly seed Math.random using hash
  var seed = Qs.parse(window.location.hash)['#seed']
  if (seed) {
    console.log(seed);
    Math.seedrandom(seed)
  } else {
    Math.seedrandom()
  }
}

function makeSVG(n_x, n_y, border=0) {

  var WIDTH = '100%';
  
  setSeed();
  
  var s = Snap('#canvas')
  s.clear()
  s.attr({
    width: WIDTH,
    viewBox: Snap.format('{min_x} {min_y} {width} {height}', {
      min_x: -border,
      min_y: -border,
      width: n_x + 2*border,
      height: n_y + 2*border
    }),
    // transform: "scale(1,0.333)",
    // transform: "rotate(180)"
  })
  var g = s.group()
  // g.rect(-1, -1, n_x + 2, n_y + 2).attr({
  //   // fill: chroma.hcl(90, 1, 100),
  //   // fill: chroma.hcl(135, 10, 10),
  //   fill: 'none',
  //   stroke: 'none'
  // })
  // g.transform(
  //   Snap.format('r{angle},{x_center},{y_center}', {
  //     angle: 180,
  //     x_center: n_x / 2,
  //     y_center: n_y / 2
  //   })
  // )
  return g
}

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string doesn't handle
  // URLEncoded DataURIs - see SO answer #6850276 for code that does
  // this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;
}

function download_svg(svg) {
  svg.toDataURL("image/png", {
    callback : function(data) {
      var image = data.replace("image/png", "image/octet-stream");
      
      var hash_pre = md5(image)
      var hash = hash_pre.substring(0, 6)
      var filename = window.location.pathname + window.location.hash + '-' + hash;
      var png_filename = filename + ".png";
      var svg_filename = filename + ".svg";

      var blob = dataURItoBlob(image);
      var blobUrl = URL.createObjectURL(blob);
      download_as_file(png_filename, blobUrl);

      var svgString = (new XMLSerializer()).serializeToString(svg);
      var svgUrl = 'data:text/plain;charset=utf-8,';
      svgUrl += encodeURIComponent(svgString);
      download_as_file(svg_filename, svgUrl);
    }
  });
}

function download(element_id='#canvas') {
  if (element_id[0] === '#') {
    var element_id = element_id.split('#')[1];
  }
  var element = document.getElementById(element_id);
  if (element.nodeName == 'svg') {
    download_svg(element);
  } else if (element.nodeName == 'CANVAS') {
    download_canvas(element);
  } else {
    console.log('unknown element', element.nodeName);
  }
}

function download_canvas(canvas) {
  var hash_pre = md5(canvas)
  var hash = hash_pre.substring(0, 6)
  var filename = window.location.pathname + window.location.hash + '-' + hash;
  var png_filename = filename + ".png";
  download_as_file(png_filename, canvas.toDataURL());
}

function download_as_file(filename, url) {
  var a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  a.remove();
}

function jitter(amount) {
  return amount * (Math.random() - 0.5);
}

function convertToPath(points) {
  var path = '';
  _.each(points, function (point, index) {
    var x = point[0]
    var y = point[1]
    if (index === 0) {
      path += 'M' + x + ',' + y + ' R'
    } else if (index === points.length - 1) {
      path += x + ',' + y
    } else {
      path += x + ',' + y + ','
    }
  })
  return path;
}


function makeid(length) {
  var seed           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    seed += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  var components = {
    'seed': seed
  };
  if (typeof parameters !== 'undefined') {
    _.each(_.keys(parameters), function(key) {
      components[key] = parameters[key].get();
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
  var result = {}
  var query_params = Qs.parse(window.location.hash);
  _.each(parameter_list, function (conf) {
    var name = conf.name;
    if (name in query_params) {
      conf['start'] = [query_params[name]];
    }
    console.log(conf);
    var parameter_div = document.createElement('div')
    parameter_div.classList.add('parameter')
    var slider = document.createElement('div')
    slider.id = "slider-" + name;
    slider.classList.add("parameter-slider")
    parameter_div.appendChild(slider);
    var sliderValue = document.createElement('input')
    sliderValue.id = "slider-" + name + '-value';
    sliderValue.classList.add('parameter-input')
    parameter_div.appendChild(sliderValue);
    parent_div.appendChild(parameter_div);
    noUiSlider.create(slider, conf);
    slider.noUiSlider.on('update', function (values, handle) {
      sliderValue.value = values[handle];
    });
    sliderValue.addEventListener('change', function () {
      slider.noUiSlider.set(this.value);
    });
    result[name] = slider.noUiSlider;
  })
  return result;
}

//http://localhost:5000/amish-quilt/#seed=NtsW8DZ&n_x=11&n_y=11&n_colors=4&stroke_width=0.00&stroke_width_inner=0.00&grid_jitter=0.50

function format_int () {
  return {
    'to': function(value) {return parseInt(value)},
    'from': function(value) {return parseInt(value)}
  }
};
