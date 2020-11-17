function submit_form() {
	var formElement = document.getElementById("map-viewer-form");
	var formData = new FormData();

	formData.append("location", document.getElementById("pac-input").value);
	formData.append("date", document.getElementById("date").value);
	create_request(formData, load_graph);
}

function create_request(formData, callback) {
	var request = new XMLHttpRequest();
	request.onreadystatechange = function() { // Call a function when the state changes.
		if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
			// Request finished. Do processing here.
			callback(request.response);
		}
	}
	request.open("POST", "/search_results");
	request.send(formData);
}
function load_graph(schedules) {
	var json = JSON.parse(schedules);
	var x = [];
	var y = [];
	for (var i = 0; i < json.length; i++) {
		x.push(json[i].time_start);
		x.push(json[i].time_end);
	}
	for (var i = 0; i < json.length; i++) {
		y.push(parseInt(json[i].no_of_people) + 1);
		y.push(parseInt(json[i].no_of_people) + 1);
	}
	var trace = {
		x: x,
		y: y,
		type: 'histogram',
	};
	var data = [trace];
	Plotly.newPlot('graph_div', data);
}