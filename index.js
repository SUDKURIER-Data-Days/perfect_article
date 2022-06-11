import Waffle from "./apps/Wafflechart";
import "./styles/global.css";
import "./styles/custom_styles.css";
import "./styles/map_styles.css";

import "leaflet/dist/leaflet.css";

import config from "./wafflechart_config";
import waffle_data from "../../data/waffle_chart.csv";

// import annotations from "./annotations";

import * as d3 from "d3";
import de from "./components/german_locale";
d3.timeFormatDefaultLocale(de);
d3.formatDefaultLocale(de);

const app = new Waffle({
	target: document.querySelector("#___waffle_chart"),
	props: {
		config: config,
		data: waffle_data,
	},
});

export default app;




import orig_data from "../../data/bubble_chart.csv"

var data = wrangle_data(orig_data)


console.log(data)

var container = d3.select('#___bubble_chart')
const intro = container.append("div").attr("class", "___chart_intro"); // Überschrift und Subtitel
const svg_container = container
.append("div")
.attr("class", "___chart_svg_container");

var legend_div = container
.append("div")
.style("text-align", "center")
.attr("class", "___chart_legende");

const quelle = container
.append("div")
.attr("class", "___chart_quelle article-figcaption"); // Quelle angeben



intro.append("h3").html('Artikelerfolg nach Themenfeld').attr("class", "___chart_intro_titel");
intro.append("p").attr("class", "___chart_intro_text").html('');

var tooltipText = function (d) {
	return d;
};

var margin = {
		top: 10,
		right: 20,
		bottom: 30,
		left: 50
	},
	width = 500 - margin.left - margin.right,
	height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#___bubble_chart")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
		"translate(" + margin.left + "," + margin.top + ")");

//Read the data

const tooltip_container = svg_container
	.append("div")
	.attr("class", "___tooltip")
	.style("opacity", 0);


// Add X axis
var x = d3.scaleLinear()
	.domain([2000, 4200])
	.range([0, width]);
svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x));

// Add Y axis
var y = d3.scaleLinear()
	.domain([50, 75])
	.range([height, 0]);
svg.append("g")
	.call(d3.axisLeft(y));

// Add a scale for bubble size
var z = d3.scaleLinear()
	.domain([0, 5500])
	.range([4, 40]);

// Add a scale for bubble color
var myColor = d3.scaleOrdinal()
	.domain(["sicherheit", "gesundheit", "sport", "politik", "kultur", 'leben', 'verkehr', 'wissen', 'wirtschaft'])
	.range(d3.schemeSet3);

// // -1- Create a tooltip div that is hidden by default:
var tooltip = d3.select("#___bubble_chart")
	.append("div")
	.style("opacity", 0)
	.attr("class", "tooltip")
	.style("background-color", "black")
	.style("border-radius", "5px")
	.style("padding", "10px")
	.style("color", "white")

// -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
function show_tooltip(event, d) {
	d3.select(this)
		.style("stroke-width", 2)
		.style("stroke", "white")
		.raise();

	tooltip_container.style("opacity", 1).html(tooltipText('Thema: ' + d['themencluster'] + '</br>Visitors: '+ Math.round(d['visitors'])+ '</br> zuende gelesen: '+ Math.round(d['zuende'])+'%'+ '</br> Zeichenanzahl: '+ Math.round(d['charactercount'])));

	console.log('hier passier was')
	var pos = d3.pointer(event)[1];

	if (pos < height / 2) {
		svg.attr(
			"style",
			"align-items:flex-end;-webkit-align-items:flex-end;-ms-flex-align:end"
		);
	} else {
		svg.attr(
			"style",
			"align-items:flex-start;-webkit-align-items:flex-start;-ms-flex-align:start"
		);
	}
}

function hide_tooltip() {
	tooltip_container.style("opacity", 0);
	// polygone.style("stroke-width", 1).style("stroke", "#878787");
}




// Add dots
svg.append('g')
	.selectAll("dot")
	.data(data)
	.enter()
	.append("circle")
	.attr("class", "bubbles")
	.attr("cx", function (d) {
		return x(d.charactercount);
	})
	.attr("cy", function (d) {
		return y(d.zuende);
	})
	.attr("r", function (d) {
		return z(d.visitors);
	})
	.style("fill", function (d) {
		return myColor(d.themencluster);
	})
	// -3- Trigger the functions
	.on("mouseover", show_tooltip)

	.on("mouseleave", hide_tooltip)


function wrangle_data(data) {
	for (const item of data) {
		item["charactercount"] = parseFloat(item["charactercount"]);
		item["visitors"] = parseFloat(item["visitors"]);
	}
	return data;
}