function setSeed(){var n=Qs.parse(window.location.hash)["#seed"];n?(console.log(n),Math.seedrandom(n)):Math.seedrandom()}function makeSVG(n,t,e=0){setSeed();var r=Snap("#canvas");return r.clear(),r.attr({width:"100%",viewBox:Snap.format("{min_x} {min_y} {width} {height}",{min_x:-e,min_y:-e,width:n+2*e,height:t+2*e})}),r.group()}function dataURItoBlob(n){for(var t=atob(n.split(",")[1]),e=n.split(",")[0].split(":")[1].split(";")[0],r=new ArrayBuffer(t.length),o=new Uint8Array(r),a=0;a<t.length;a++)o[a]=t.charCodeAt(a);return new Blob([r],{type:e})}function download_svg(n){n.toDataURL("image/png",{callback:function(t){var e=t.replace("image/png","image/octet-stream"),r=md5(e).substring(0,6),o=window.location.pathname+window.location.hash+"-"+r,a=o+".png",i=o+".svg",u=dataURItoBlob(e);download_as_file(a,URL.createObjectURL(u));var c=(new XMLSerializer).serializeToString(n),d="data:text/plain;charset=utf-8,";download_as_file(i,d+=encodeURIComponent(c))}})}function download(n="#canvas"){if("#"===n[0])n=n.split("#")[1];var t=document.getElementById(n);"svg"==t.nodeName?download_svg(t):"CANVAS"==t.nodeName?download_canvas(t):console.log("unknown element",t.nodeName)}function download_canvas(n){var t=md5(n).substring(0,6);download_as_file(window.location.pathname+window.location.hash+"-"+t+".png",n.toDataURL())}function download_as_file(n,t){var e=document.createElement("a");e.href=t,e.download=n,e.click(),e.remove()}function jitter(n){return n*(Math.random()-.5)}function convertToPath(n){var t="";return _.each(n,function(e,r){var o=e[0],a=e[1];0===r?t+="M"+o+","+a+" R":r===n.length-1?t+=o+","+a:t+=o+","+a+","}),t}function makeid(n){for(var t="",e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",r=e.length,o=0;o<n;o++)t+=e.charAt(Math.floor(Math.random()*r));var a={seed:t};return"undefined"!=typeof parameters&&_.each(_.keys(parameters),function(n){a[n]=parameters[n].get()}),Qs.stringify(a)}function compliment(n,t,e){void 0===t&&(t=180),void 0===e&&(e=1);var r=n.hcl()[0]+t,o=n.hcl()[1],a=n.hcl()[2]*e;return chroma.hcl(r,o,a)}function make_parameters(n,t){var e=document.getElementById(n),r={},o=Qs.parse(window.location.hash);return _.each(t,function(n){var t=n.name;t in o&&(n.start=[o[t]]),console.log(n);var a=document.createElement("div");a.classList.add("parameter");var i=document.createElement("div");i.id="slider-"+t,i.classList.add("parameter-slider"),a.appendChild(i);var u=document.createElement("input");u.id="slider-"+t+"-value",u.classList.add("parameter-input"),a.appendChild(u),e.appendChild(a),noUiSlider.create(i,n),i.noUiSlider.on("update",function(n,t){u.value=n[t]}),u.addEventListener("change",function(){i.noUiSlider.set(this.value)}),r[t]=i.noUiSlider}),r}function format_int(){return{to:function(n){return parseInt(n)},from:function(n){return parseInt(n)}}}!function(){function n(n){var t=[],e=Math.pow(n+16,3)/1560896;e=e>R?e:n/I;for(var r=0;3>r;){var o=r++,a=S[o][0],i=S[o][1];o=S[o][2];for(var u=0;2>u;){var c=u++,d=(632260*o-126452*i)*e+126452*c;t.push({b:(284517*a-94839*o)*e/d,a:((838422*o+769860*i+731718*a)*n*e-769860*c*n)/d})}}return t}function t(t){t=n(t);for(var e=1/0,r=0;r<t.length;){var o=t[r];++r,e=Math.min(e,Math.abs(o.a)/Math.sqrt(Math.pow(o.b,2)+1))}return e}function e(t,e){e=e/360*Math.PI*2,t=n(t);for(var r=1/0,o=0;o<t.length;){var a=t[o];++o,0<=(a=a.a/(Math.sin(e)-a.b*Math.cos(e)))&&(r=Math.min(r,a))}return r}function r(n,t){for(var e=0,r=0,o=n.length;r<o;){var a=r++;e+=n[a]*t[a]}return e}function o(n){return.0031308>=n?12.92*n:1.055*Math.pow(n,.4166666666666667)-.055}function a(n){return.04045<n?Math.pow((n+.055)/1.055,2.4):n/12.92}function i(n){return[o(r(S[0],n)),o(r(S[1],n)),o(r(S[2],n))]}function u(n){return n=[a(n[0]),a(n[1]),a(n[2])],[r(L[0],n),r(L[1],n),r(L[2],n)]}function c(n){var t=n[0],e=n[1];return 0!=(n=t+15*e+3*n[2])?(t=4*t/n,n=9*e/n):n=t=NaN,0==(e=e<=R?e/k*I:116*Math.pow(e/k,.3333333333333333)-16)?[0,0,0]:[e,13*e*(t-_),13*e*(n-N)]}function d(n){var t=n[0];if(0==t)return[0,0,0];var e=n[1]/(13*t)+_;return n=n[2]/(13*t)+N,[e=0-9*(t=8>=t?k*t/I:k*Math.pow((t+16)/116,3))*e/((e-4)*n-e*n),t,(9*t-15*n*t-n*e)/(3*n)]}function l(n){var t=n[0],e=n[1],r=n[2];return 1e-8>(n=Math.sqrt(e*e+r*r))?e=0:0>(e=180*Math.atan2(r,e)/Math.PI)&&(e=360+e),[t,n,e]}function s(n){var t=n[1],e=n[2]/360*2*Math.PI;return[n[0],Math.cos(e)*t,Math.sin(e)*t]}function h(n){var t=n[0],r=n[1];return 99.9999999<(n=n[2])?[100,0,t]:1e-8>n?[0,0,t]:[n,r=e(n,t)/100*r,t]}function f(n){var t=n[0],r=n[1];return n=n[2],99.9999999<t?[n,0,100]:1e-8>t?[n,0,0]:[n,r/e(t,n)*100,t]}function v(n){var e=n[0],r=n[1];return 99.9999999<(n=n[2])?[100,0,e]:1e-8>n?[0,0,e]:[n,r=t(n)/100*r,e]}function g(n){var e=n[0],r=n[1];return n=n[2],99.9999999<e?[n,0,100]:1e-8>e?[n,0,0]:[n,r/t(e)*100,e]}function p(n){for(var t="#",e=0;3>e;){var r=e++,o=(r=Math.round(255*n[r]))%16;t+=U.charAt((r-o)/16|0)+U.charAt(o)}return t}function m(n){n=n.toLowerCase();for(var t=[],e=0;3>e;){var r=e++;t.push((16*U.indexOf(n.charAt(2*r+1))+U.indexOf(n.charAt(2*r+2)))/255)}return t}function w(n){return i(d(s(n)))}function M(n){return l(c(u(n)))}function b(n){return w(h(n))}function x(n){return f(M(n))}function T(n){return w(v(n))}function y(n){return g(M(n))}var S=[[3.240969941904521,-1.537383177570093,-.498610760293],[-.96924363628087,1.87596750150772,.041555057407175],[.055630079696993,-.20397695888897,1.056971514242878]],L=[[.41239079926595,.35758433938387,.18048078840183],[.21263900587151,.71516867876775,.072192315360733],[.019330818715591,.11919477979462,.95053215224966]],k=1,_=.19783000664283,N=.46831999493879,I=903.2962962,R=.0088564516,U="0123456789abcdef";window.hsluv={hsluvToRgb:b,rgbToHsluv:x,hpluvToRgb:T,rgbToHpluv:y,hsluvToHex:function(n){return p(b(n))},hexToHsluv:function(n){return x(m(n))},hpluvToHex:function(n){return p(T(n))},hexToHpluv:function(n){return y(m(n))},lchToHpluv:g,hpluvToLch:v,lchToHsluv:f,hsluvToLch:h,lchToLuv:s,luvToLch:l,xyzToLuv:c,luvToXyz:d,xyzToRgb:i,rgbToXyz:u,lchToRgb:w,rgbToLch:M}}(),SVGElement.prototype.toDataURL=function(n,t){var e,r=this,o=1200;function a(n){console.log("SVG.toDataURL:",n)}function i(n){return window.XMLSerializer?(a("using standard XMLSerializer.serializeToString"),(new XMLSerializer).serializeToString(n)):(a("using custom XMLSerializerForIE"),function n(t){var e="";e+="<"+t.nodeName;for(var r=0;r<t.attributes.length;r++)e+=" "+t.attributes[r].name+"='"+t.attributes[r].value+"'";if(t.hasChildNodes()){for(e+=">\n",r=0;r<t.childNodes.length;r++)e+=n(t.childNodes[r]);e+="</"+t.nodeName+">\n"}else e+=" />\n";return e}(n))}function u(n){var t="data:image/svg+xml;base64,";return window.btoa?(a("using window.btoa for base64 encoding"),t+=btoa(n)):(a("using custom base64 encoder"),t+=Base64.encode(n)),t}switch(n||(n="image/svg+xml"),t||(t={}),t.keepNonSafe&&a("NOTE: keepNonSafe is NOT supported and will be ignored!"),t.keepOutsideViewport&&a("NOTE: keepOutsideViewport is only supported with canvg exporter."),n){case"image/svg+xml":return e=u(i(r)),a(n+" length: "+e.length),t.callback&&t.callback(e),e;case"image/png":case"image/jpeg":switch(t.renderer||(window.canvg?t.renderer="canvg":t.renderer="native"),t.renderer){case"canvg":return a("using canvg renderer for png export"),function(n){var e=document.createElement("canvas"),o=(e.getContext("2d"),i(r)),u=t.keepOutsideViewport;if(u)var c=r.getBBox();return canvg(e,o,{ignoreMouse:!0,ignoreAnimation:!0,offsetX:u?-c.x:void 0,offsetY:u?-c.y:void 0,scaleWidth:u?c.width+c.x:void 0,scaleHeight:u?c.height+c.y:void 0,renderCallback:function(){a("exported image dimensions "+[e.width,e.height]);var r=e.toDataURL(n);a(n+" length: "+r.length),t.callback&&t.callback(r)}}),e.toDataURL(n)}(n);case"native":return a("using native renderer for png export. THIS MIGHT FAIL."),function(n){var e=document.createElement("canvas"),c=e.getContext("2d"),d=new Image,l=i(r);d.src=u(l),d.onload=function(){a("exported image size: "+[d.width,d.height]),e.width=o,e.height=o*(d.height/d.width),c.drawImage(d,0,0);var r=e.toDataURL(n);a(n+" length: "+r.length),t.callback?t.callback(r):a("WARNING: no callback set, so nothing happens.")},d.onerror=function(){console.log("Can't export! Maybe your browser doesn't support SVG in img element or SVG input for Canvas drawImage?\nhttp://en.wikipedia.org/wiki/SVG#Native_support")}}(n);default:a("unknown png renderer given, doing noting ("+t.renderer+")")}break;default:a("Sorry! Exporting as '"+n+"' is not supported!")}},function(n){var t=n.noise={};function e(n,t,e){this.x=n,this.y=t,this.z=e}e.prototype.dot2=function(n,t){return this.x*n+this.y*t},e.prototype.dot3=function(n,t,e){return this.x*n+this.y*t+this.z*e};var r=[new e(1,1,0),new e(-1,1,0),new e(1,-1,0),new e(-1,-1,0),new e(1,0,1),new e(-1,0,1),new e(1,0,-1),new e(-1,0,-1),new e(0,1,1),new e(0,-1,1),new e(0,1,-1),new e(0,-1,-1)],o=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],a=new Array(512),i=new Array(512);t.seed=function(n){n>0&&n<1&&(n*=65536),(n=Math.floor(n))<256&&(n|=n<<8);for(var t=0;t<256;t++){var e;e=1&t?o[t]^255&n:o[t]^n>>8&255,a[t]=a[t+256]=e,i[t]=i[t+256]=r[e%12]}},t.seed(0);var u=.5*(Math.sqrt(3)-1),c=(3-Math.sqrt(3))/6,d=1/6;function l(n){return n*n*n*(n*(6*n-15)+10)}function s(n,t,e){return(1-e)*n+e*t}t.simplex2=function(n,t){var e,r,o=(n+t)*u,d=Math.floor(n+o),l=Math.floor(t+o),s=(d+l)*c,h=n-d+s,f=t-l+s;h>f?(e=1,r=0):(e=0,r=1);var v=h-e+c,g=f-r+c,p=h-1+2*c,m=f-1+2*c,w=i[(d&=255)+a[l&=255]],M=i[d+e+a[l+r]],b=i[d+1+a[l+1]],x=.5-h*h-f*f,T=.5-v*v-g*g,y=.5-p*p-m*m;return 70*((x<0?0:(x*=x)*x*w.dot2(h,f))+(T<0?0:(T*=T)*T*M.dot2(v,g))+(y<0?0:(y*=y)*y*b.dot2(p,m)))},t.simplex3=function(n,t,e){var r,o,u,c,l,s,h=(n+t+e)*(1/3),f=Math.floor(n+h),v=Math.floor(t+h),g=Math.floor(e+h),p=(f+v+g)*d,m=n-f+p,w=t-v+p,M=e-g+p;m>=w?w>=M?(r=1,o=0,u=0,c=1,l=1,s=0):m>=M?(r=1,o=0,u=0,c=1,l=0,s=1):(r=0,o=0,u=1,c=1,l=0,s=1):w<M?(r=0,o=0,u=1,c=0,l=1,s=1):m<M?(r=0,o=1,u=0,c=0,l=1,s=1):(r=0,o=1,u=0,c=1,l=1,s=0);var b=m-r+d,x=w-o+d,T=M-u+d,y=m-c+2*d,S=w-l+2*d,L=M-s+2*d,k=m-1+.5,_=w-1+.5,N=M-1+.5,I=i[(f&=255)+a[(v&=255)+a[g&=255]]],R=i[f+r+a[v+o+a[g+u]]],U=i[f+c+a[v+l+a[g+s]]],z=i[f+1+a[v+1+a[g+1]]],A=.6-m*m-w*w-M*M,E=.6-b*b-x*x-T*T,C=.6-y*y-S*S-L*L,H=.6-k*k-_*_-N*N;return 32*((A<0?0:(A*=A)*A*I.dot3(m,w,M))+(E<0?0:(E*=E)*E*R.dot3(b,x,T))+(C<0?0:(C*=C)*C*U.dot3(y,S,L))+(H<0?0:(H*=H)*H*z.dot3(k,_,N)))},t.perlin2=function(n,t){var e=Math.floor(n),r=Math.floor(t);n-=e,t-=r;var o=i[(e&=255)+a[r&=255]].dot2(n,t),u=i[e+a[r+1]].dot2(n,t-1),c=i[e+1+a[r]].dot2(n-1,t),d=i[e+1+a[r+1]].dot2(n-1,t-1),h=l(n);return s(s(o,c,h),s(u,d,h),l(t))},t.perlin3=function(n,t,e){var r=Math.floor(n),o=Math.floor(t),u=Math.floor(e);n-=r,t-=o,e-=u;var c=i[(r&=255)+a[(o&=255)+a[u&=255]]].dot3(n,t,e),d=i[r+a[o+a[u+1]]].dot3(n,t,e-1),h=i[r+a[o+1+a[u]]].dot3(n,t-1,e),f=i[r+a[o+1+a[u+1]]].dot3(n,t-1,e-1),v=i[r+1+a[o+a[u]]].dot3(n-1,t,e),g=i[r+1+a[o+a[u+1]]].dot3(n-1,t,e-1),p=i[r+1+a[o+1+a[u]]].dot3(n-1,t-1,e),m=i[r+1+a[o+1+a[u+1]]].dot3(n-1,t-1,e-1),w=l(n),M=l(t),b=l(e);return s(s(s(c,v,w),s(d,g,w),b),s(s(h,p,w),s(f,m,w),b),M)}}(this);