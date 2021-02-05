let width = 900
let height = 600
let bar_height = height / 2 - 40

let formatNumber = d3.format(".1~r");

let color = d3.scaleOrdinal()
    .range(["blue"])

// .range(["#8dd3c7", "#ffffb3", "#bebada",
// "#fb8072", "#80b1d3", "#fdb462",
// "#b3de69", "#fccde5", "#d9d9d9",
// "#bc80bd", "#ccebc5", "#ffed6f"]);

var svg = d3.select('body').append("svg")
    .attr("id", "radial_chart")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

function removeOldChart() {
    d3.select("#radial_chart")
        .remove();
}

function createNewChart(data) {
    removeOldChart()
    svg = d3.select("#svg-element").append("svg")
        .attr("id", "radial_chart")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


    let result = []
    Object.keys(data[0]).forEach(key => {
        result.push({name: key, value: data[0][key]})
    })


    let barScale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, bar_height]);

    let x = d3.scaleLinear()
        .domain([0, 100])
        .range([0, -bar_height]);


    let xAxis = d3.axisLeft(x)
        .ticks(3)
        .tickFormat(formatNumber => formatNumber + "%");

    let keys = Object.keys(data[0])
    let numBars = keys.length;


    let arc = d3.arc()
        .startAngle(function (d, i) {
            return (i * 2 * Math.PI) / numBars;
        })
        .endAngle(function (d, i) {
            return ((i + 1) * 2 * Math.PI) / numBars;
        })
        .innerRadius(0)

    function handle_mouse_over(d, i) {
        d3.select(this)
            .style("fill", "green");

        let x_var = d.name;
        let info = get_info_on_var(x_var);
        let label = "<strong>Variable: </strong>" + info[0]
        let value = "<br><strong>Percentage: </strong>" + d.value + "%";
        let definition = "<br><strong>Explanation: </strong>" + info[1];

        let textbox = document.getElementById("info-text")
        textbox.innerHTML = label + value + definition
    }

    function handle_mouse_out(d, i) {
        d3.select(this)
            .style("fill", "blue");

        let textbox = document.getElementById("info-text")
        textbox.innerHTML = ""
    }


    var segments = svg.selectAll("path")
        .data(result)
        .enter().append("path")
        .each(function (d) {
            d.outerRadius = 0;
        })
        .style("fill", function (d) {
            return color(d.name);
        })
        .attr("d", arc)
        .on("mouseover", handle_mouse_over)
        .on("mouseout", handle_mouse_out)

    segments.transition().ease(d3.easeLinear).duration(1000).delay(function (d, i) {
        return (25 - i) * 100;
    })
        .attrTween("d", function (d, index) {
            let i = d3.interpolate(d.outerRadius, barScale(+d.value));
            return function (t) {
                d.outerRadius = i(t);
                return arc(d, index);
            };
        });

    svg.append("circle")
        .attr("r", bar_height)
        .classed("outer", true)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", "1.5px");

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    let labelRadius = bar_height * 1.025;

    let labels = svg.append("g")
        .classed("labels", true);

    labels.append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

    labels.selectAll("text")
        .data(keys)
        .enter().append("text")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", function (d, i) {
            return "#3e3e3e";
        })
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function (d, i) {
            return i * 100 / numBars + 50 / numBars + '%';
        })
        .text(function (d) {
            return d.toUpperCase();
        });
}


function updateArea(selected) {
    let fetch_url = "/d3_plot_data?area_name=" + selected.value;
    fetch(fetch_url)
        .then(function (response) {
            return response.json();
        })
        .then((data) => {
            createNewChart(data);
        });
}


function get_info_on_var(variable) {
    var rel_meta = meta_data.find(function (d) {
        return d.Variabele == variable;
    })


    let label = rel_meta['Label_1'];
    let definition = rel_meta['Definition'];

    return [label, definition]
}
