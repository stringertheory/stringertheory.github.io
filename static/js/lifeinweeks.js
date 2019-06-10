/* license for this code at /license.txt */

// http://peterbeshai.com/scatterplot-in-d3-with-voronoi-interaction.html

function getIndex(now, birthday) {
  var prevBirthday = moment(birthday).year(now.year());
  var nextBirthday = moment(birthday).year(now.year() + 1);
  if (now < prevBirthday) {
    prevBirthday = moment(birthday).year(now.year() - 1);
    nextBirthday = moment(birthday).year(now.year());
  }
  var yearIndex = (prevBirthday.year() - birthday.year()) * 52;
  var weekIndex = Math.floor(52 * (now - prevBirthday) / (nextBirthday - prevBirthday));
  // var weekIndex = Math.floor((now - prevBirthday) / WEEK);
  return (yearIndex + weekIndex);
}

var birthday = moment('1982-07-25', 'YYYY-MM-DD')
var WEEK = 7 * 24 * 60 * 60 * 1000;
var todayIndex = getIndex(moment(), birthday);
console.log(todayIndex);

const n_weeks = 52;
const n_years = 90;

var data = [];
for (var i=0; i < (n_weeks * (n_years + 1)); i++) {
  data.push([]);
}
console.log(moment.duration(36 + 42.22, 'years'))
var events = {
  'family': [{
    'description': 'Met Abbie',
    'date': moment('2007-03-03', 'YYYY-MM-DD')
  }, {
    'description': 'Married Abbie',
    'date': moment('2011-10-22', 'YYYY-MM-DD')
  }, {
    'description': 'Ottilie born',
    'date': moment('2013-11-17', 'YYYY-MM-DD')
  }, {
    'description': 'Estelle born',
    'date': moment('2016-06-28', 'YYYY-MM-DD')
  }, {
    'description': 'Datascope started',
    'date': moment('2009-07-01', 'YYYY-MM-DD')
  }, {
    'description': 'Grad school started',
    'date': moment('2004-09-01', 'YYYY-MM-DD')
  }, {
    'description': 'College started',
    'date': moment('2000-08-26', 'YYYY-MM-DD')
  }, {
    'description': 'Datascope sold / started at IDEO',
    'date': moment('2017-10-13', 'YYYY-MM-DD')
  }, {
    'description': 'Life expectancy?',
    'date': moment('1982-07-25', 'YYYY-MM-DD').add(65, 'years')
  }, {
    'description': 'Life expectancy?',
    'date': moment('1982-07-25', 'YYYY-MM-DD').add(36 + 42.22, 'years')
  }, {
    'description': 'Life expectancy?',
    'date': moment('1982-07-25', 'YYYY-MM-DD').add(83, 'years')
  }, {
    'description': 'Dad died',
    'date': moment('2019-03-10', 'YYYY-MM-DD')
  }]
}
Object.keys(events).forEach(function (category) {
  events[category].forEach(function (event) {
    var index = getIndex(event.date, birthday);
    if (index >= 0) {
      data[index].push(event.description);
    }
  });
});

// home = [
//   july 25, 1982 - august 2000, 'colorado springs'
//   august 2000 - september 2004, 'boulder'
//   september 2004 - september 2006, 'evanston'
//   september 2006 - current, 'chicago'
// ]
// work = [
//   1987-1993 'rockrimmon elementary school',
//   1993-1996 'eagleview middle school',
//   august 1996 - august 2000, 'air academy high school',
//   august 2000 - may 2004, 'university of colorado',
//   august 2004 - september 2009, 'northwestern university',
//   september 2009 - october 2017, 'datascope',
//   october 2017 - current, 'ideo',
// ]
// // interesting to put when these started: i.e. how long did it take for einstein to become awesome?
// famous_accomplishments = [
//     ? 'einstein relativity',
//     ? 'martin luther king i have a dream',
//     ? 'gold medal'
//     ? 'famous young entrepreneur'
//     ? 'bjork makes it big'
//     ? 'somebody who started learning something pretty late',
//     ? 'somebody who started learning something pretty late',
// ]
// deaths = [
//   'feynman',
//   'darwin',
//   'j.s. bach',
//   'life expectancy'
// ]
what_i_wanted_to_do = [
  'paleontologist',
  'lounge pianist',
  'architect',
  'baseball player',
  'mechanical engineer',
  'electrical engineer',
  'physicist',
  'biologist?',
  'artist?',
  'writer?',
]

// outer svg dimensions
const width = 400;

// padding around the chart where axes will go
const padding = {
  top: 30,
  right: 0,
  bottom: 10,
  left: 30,
};

// inner chart dimensions, where the dots are plotted
const squish = 1;
const plotAreaWidth = width - padding.left - padding.right;
const plotAreaHeight = plotAreaWidth * (n_years / n_weeks) * squish;
const height = plotAreaHeight + padding.bottom + padding.top;

// initialize scales
const xScale = d3.scaleLinear().domain([1, n_weeks + 1]).range([0, plotAreaWidth]);
const yScale = d3.scaleLinear().domain([0, n_years]).range([0, plotAreaHeight]);

// select the root container where the chart will be added
const container = d3.select('#vis-container');

var pointRadius = plotAreaWidth / n_weeks / 2;

// initialize main SVG
const svg = container.append('svg')
  .attr('width', width)
  .attr('height', height);

// the main <g> where all the chart content goes inside
const g = svg.append('g')
  .attr('transform', `translate(${padding.left} ${padding.top})`);

// add in axis groups
const xAxisG = g.append('g').classed('x-axis', true)
  .attr('transform', `translate(0 ${-2*pointRadius})`);

const yAxisG = g.append('g').classed('y-axis', true)
  .attr('transform', `translate(${-2*pointRadius} 0)`);

// set up axis generating functions
const xTicks = Math.round(plotAreaWidth / 50);
const yTicks = Math.round(plotAreaHeight / 50);

const xAxis = d3.axisTop(xScale)
  .ticks(xTicks)
      .tickSize(0);

const yAxis = d3.axisLeft(yScale)
  .ticks(yTicks)
      .tickSize(0);

// draw the axes
yAxisG.call(yAxis);
xAxisG.call(xAxis);

// add in circles
const rectPad = 1;
const circles = g.append('g').attr('class', 'circles');
const binding = circles.selectAll('.data-point').data(data, d => d.id);
binding.enter().append('svg:rect')
  .classed('data-point', true)
  .attr('r', pointRadius)
  .attr('x', function (d, i) {
    return xScale((i % n_weeks + 1 - 0.5)) + (rectPad / 2);
  })
  .attr('y', function (d, i) {
    return yScale(Math.floor(i / n_weeks) - 0.5) + (rectPad / 2);
  })
  .attr('width', xScale(1) - xScale(0) - rectPad)
  .attr('height', function (d, i) {
    if (d.length > 0) {
      return yScale(1) - yScale(0) - rectPad;
    } else {
      return yScale(1) - yScale(0) - rectPad;
    }
  })
  .attr('fill-opacity', 1)
  .attr('fill', function (d, i) {
    if (d.length > 0) {
      console.log(d)
      return chroma('black');//.luminance(0.5 * Math.random(), 'lab');      
    } else if (i > todayIndex) {
      let fade = 3;
      let fadeSpeed = 0.8;
      let x = fadeSpeed * (i / n_weeks) / (fade * n_years);
      return chroma.rgb(0,0,0).luminance(1 - 1 / fade + x, 'lab');
    } else {
      return chroma('DarkSeaGreen');//.luminance(0.5 * Math.random(), 'lab');
    }
  }).append('svg:title')
  .text(function (d, i) {
    return d[0];
  })
;


