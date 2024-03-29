/* license for this code at /license.txt */

function getIndex(now, birthday) {
  var prevBirthday = moment(birthday).year(now.year());
  var nextBirthday = moment(birthday).year(now.year() + 1);
  if (now < prevBirthday) {
    prevBirthday = moment(birthday).year(now.year() - 1);
    nextBirthday = moment(birthday).year(now.year());
  }
  var yearIndex = (prevBirthday.year() - birthday.year()) * 52;
  var weekIndex = Math.floor(52 * (now - prevBirthday) / (nextBirthday - prevBirthday));
  return yearIndex + weekIndex;
}

var birthday = moment("1982-07-25", "YYYY-MM-DD");

var WEEK = 7 * 24 * 60 * 60 * 1e3;

var todayIndex = getIndex(moment(), birthday);

console.log(todayIndex);

const n_weeks = 52;

const n_years = 90;

var data = [];

for (var i = 0; i < n_weeks * (n_years + 1); i++) {
  data.push([]);
}

var events = {
  family: [ {
    description: "Met Abbie",
    date: moment("2007-03-03", "YYYY-MM-DD")
  }, {
    description: "Married Abbie",
    date: moment("2011-10-22", "YYYY-MM-DD")
  }, {
    description: "Ottilie born",
    date: moment("2013-11-17", "YYYY-MM-DD")
  }, {
    description: "Estelle born",
    date: moment("2016-06-28", "YYYY-MM-DD")
  }, {
    description: "Datascope started",
    date: moment("2009-07-01", "YYYY-MM-DD")
  }, {
    description: "Grad school started",
    date: moment("2004-09-01", "YYYY-MM-DD")
  } ]
};

Object.keys(events).forEach(function(category) {
  events[category].forEach(function(event) {
    var index = getIndex(event.date, birthday);
    if (index >= 0) {
      data[index].push(event.description);
    }
  });
});

what_i_wanted_to_do = [ "lounge pianist" ];

const width = 400;

const padding = {
  top: 30,
  right: 0,
  bottom: 10,
  left: 30
};

const squish = 1;

const plotAreaWidth = width - padding.left - padding.right;

const plotAreaHeight = plotAreaWidth * (n_years / n_weeks) * squish;

const height = plotAreaHeight + padding.bottom + padding.top;

const xScale = d3.scaleLinear().domain([ 1, n_weeks + 1 ]).range([ 0, plotAreaWidth ]);

const yScale = d3.scaleLinear().domain([ 0, n_years ]).range([ 0, plotAreaHeight ]);

const container = d3.select("#vis-container");

var pointRadius = plotAreaWidth / n_weeks / 2;

const svg = container.append("svg").attr("width", width).attr("height", height);

const g = svg.append("g").attr("transform", `translate(${padding.left} ${padding.top})`);

const xAxisG = g.append("g").classed("x-axis", true).attr("transform", `translate(0 ${-2 * pointRadius})`);

const yAxisG = g.append("g").classed("y-axis", true).attr("transform", `translate(${-2 * pointRadius} 0)`);

const xTicks = Math.round(plotAreaWidth / 50);

const yTicks = Math.round(plotAreaHeight / 50);

const xAxis = d3.axisTop(xScale).ticks(xTicks).tickSize(0);

const yAxis = d3.axisLeft(yScale).ticks(yTicks).tickSize(0);

yAxisG.call(yAxis);

xAxisG.call(xAxis);

const rectPad = 1;

const circles = g.append("g").attr("class", "circles");

const binding = circles.selectAll(".data-point").data(data, d => d.id);

binding.enter().append("rect").classed("data-point", true).attr("r", pointRadius).attr("x", function(d, i) {
  return xScale(i % n_weeks + 1 - .5) + rectPad / 2;
}).attr("y", function(d, i) {
  return yScale(Math.floor(i / n_weeks) - .5) + rectPad / 2;
}).attr("width", xScale(1) - xScale(0) - rectPad).attr("height", yScale(1) - yScale(0) - rectPad).attr("fill-opacity", 1).attr("fill", function(d, i) {
  if (d.length > 0) {
    return chroma("black");
  } else if (i > todayIndex) {
    let fade = 3;
    let fadeSpeed = .8;
    let x = fadeSpeed * (i / n_weeks) / (fade * n_years);
    return chroma.rgb(0, 0, 0).luminance(1 - 1 / fade + x, "lab");
  } else {
    return chroma("DarkSeaGreen");
  }
});
