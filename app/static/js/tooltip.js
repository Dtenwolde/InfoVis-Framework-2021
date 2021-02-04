function displayTooltip(htmlText, waiting_time=false) {
	MOUSEOVER = true;
	let tooltipLength = htmlText.length;
	tooltipLength = Math.max(7, tooltipLength)
	tooltipPosition = d3.event.pageX - tooltipLength

	let tooltip = d3.select("#tooltip");
	tooltip.style("left", Math.max(0, tooltipPosition) + "px")
			.style("top", (d3.event.pageY + 15) + "px")
			.style("width", (tooltipLength * 1.5 + 30) + "px")
			.style("display", "inline")
			.html(htmlText);
};

function hideTooltip() {
	MOUSEOVER = false;

	let tooltip = d3.select("#tooltip");
	tooltip.style("display","none");
}

