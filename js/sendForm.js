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
	var x = ["12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM", "8 AM", "9 AM", "10 AM", "11 AM", "12 PM",
	"1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM"];
	var y = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	for (var i = 0; i < json.length; i++) {
		for (var k = new Date(json[i].time_start).getHours(); k <= new Date(json[i].time_end).getHours(); k++) {
			y[k] += parseInt(json[i].no_of_people) + 1;
		}
	}
	var trace = {
		x: x,
		y: y,
		type: 'bar'
	};
	var layout = {
		title: "People in this location on " + json[0].date
	};
	var data = [trace];
	Plotly.newPlot('graph_div', data, layout);
}