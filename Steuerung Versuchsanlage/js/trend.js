// variable that represents the trend (created using the 'flot' jQuery plug-in)
var flotTrend;

// initialize data object
var trendData = [{label: 'F&uuml;llstand 1', data: new Array(100)},
                 {label: 'F&uuml;llstand 2', data: new Array(100)},
                 {label: 'F&uuml;llstand 3', data: new Array(100)}];

// stores the process data for 'level1'
var level1Data = new Array(100);
// stores the process data for 'level2'
var level2Data = new Array(100);
// stores the process data for 'level3'
var level3Data = new Array(100);

// options for displaying the trend
var trendOptions = {
		yaxis: { min: 0, max: 300 },
		xaxis: {min: 0, max: 100},
		legend: {position: "ne"}
};

function initTrend(){
	flotTrend = $.plot($('#trend'), trendData , trendOptions);
}

function updateTrend(data){
	// update arrays
	level1Data.unshift(data.level1);
	level1Data.pop();
	level2Data.unshift(data.level2);
	level2Data.pop();
	level3Data.unshift(data.level3);
	level3Data.pop();

	// update trend data
	for(var i=0; i<level1Data.length; i++){
		trendData[0].data[i] = [i,level1Data[i]];
		trendData[1].data[i] = [i,level2Data[i]];
		trendData[2].data[i] = [i,level3Data[i]];
	}
	
	// pass data to 'flotTrend'
	flotTrend.setData(trendData);
	
	// draw the updated trend
	flotTrend.draw();
}