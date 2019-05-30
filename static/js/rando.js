// function hue_difference(a, b) {
//   var h_a = a.hcl()[0];
//   var h_b = b.hcl()[0];
//   var d = Math.abs(h_a - h_b);
//   return d;
// }

// var hackRandom = (function () {

//   var self = {};
  
//   // use new seed every day/hour/minute/second, adapted from:
//   // http://stackoverflow.com/a/19303725/1431778
//   // http://stackoverflow.com/a/3894087/1431778
//   var now = new Date();
//   var SEED = now.setHours(now.getHours(), now.getMinutes(), 0, 0);
  
//   self.get = function () {
//     var x = Math.sin(SEED++) * 10000;
//     return x - Math.floor(x);
//   }
//   self.getInt = function (min, max) {
//     min = Math.ceil(min);
//     max = Math.floor(max);
//     return Math.floor(self.get() * (max - min)) + min;
//   }
  
//   return self;
// }());



// $(document).ready(function () {
//   var rando = [];
//   $('ul.lister > li').each(function (index, element) {
//     var found = false;
//     var i = 0;
//     var diff = 0;
//     var previous = rando[index - 1];
//     if (previous === undefined) {
//       previous = chroma.random();
//     }
//     var previous2 = rando[index - 2];
//     if (previous2 === undefined) {
//       previous2 = chroma.random();
//     }
//     var previous3 = rando[index - 3];
//     if (previous3 === undefined) {
//       previous3 = chroma.random();
//     }
//     while (!(found)) {
//       i += 1
//       console.log('hi');
//       var h = hackRandom.getInt(0, 12) * 30;
//       console.log('berg', h);
//       // var h = index * 45;
//       // var h = 225;//360 * Math.random();
//       var c = 60;//100;// * Math.random();
//       var l = 80;//50 + 50 * Math.random();
//       var color = chroma.hcl(h, c, l);
//       // var r = 255 * Math.random();
//       // var g = 255 * Math.random();
//       // var b = 255 * Math.random();
//       // var color = chroma.random();
//       found = color;
//       console.log(chroma.contrast(color, 'black'), chroma.contrast(color, 'white'));
//       if (chroma.contrast(color, 'black') > 15 && hue_difference(color, previous) > diff && hue_difference(color, previous2) > diff && hue_difference(color, previous3) > diff) {
//         found = color;
//         rando[index] = color;
        
//         console.log(i, element, found, found.hex(), previous, chroma.contrast(color, 'black'), hue_difference(color, previous));
//       }
//     }
//     $(this).css({"background-color": found.hex()});
//     $(this).find('p.title').css({"color": found.darken(4).hex()});
//     $(this).find('p.date').css({"color": found.darken(2).hex()});
//     console.log('huh');
//   });
// });
