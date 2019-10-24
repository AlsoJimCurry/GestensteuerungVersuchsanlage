
function process(){
	var currentData = {
		'level1': 0,
		'level2': 0,
		'level3': 0,
				
		'level1Low': false,		// active from  10
		'level2Low': false,		// active from 100
		'level3Low': false,		// active from  50
		
		'level1High': false,	// active from 180
		'level2High': false,	// active from 180
		'level3High': false,	// active from 150
		
		// pumps can be run in forward (1) or reverse (-1) mode
		'pump1to2' : 0,			// 1: from 1 to 2; -1 from: 2 to 1; 0: none		
		'pump1to3' : 0,			// 1: from 1 to 3; -1 from: 3 to 1; 0: none
		'pump2to3' : 0			// 1: from 2 to 3; -1 from: 3 to 2; 0: none
	};
	
	var simulationActive = false;
	var callbackFunction;

	var levelSum = 350;
	var lastLevelChange = 0;
	var flow = 1;
	
	var calculateLevels = function(){
		// if any pump is in action
		if(currentData.pump1to2 != 0 
			|| currentData.pump1to3 != 0
			|| currentData.pump2to3 != 0){
				var now = new Date();
				if(now - lastLevelChange > 1000 * 1){
					var target, source;
					switch(currentData.pump1to2){
						case 1 : 
							source = 'level1';
							target = 'level2';
							break;
						case -1 : 
							source = 'level2';
							target = 'level1';
							break;
					}
					if(currentData[target] <= (280-flow) && currentData[source] >= flow){
						currentData[target] += flow;
						currentData[source] -= flow; 
					}
					target = null;
					source = null;
					switch(currentData.pump1to3){
						case 1 : 
							source = 'level1';
							target = 'level3';
							break;

						case -1 : 
							source = 'level3';
							target = 'level1';
							break;
					}
					if(currentData[target] <= (280-flow) && currentData[source] >= flow){
						currentData[target] += flow;
						currentData[source] -= flow; 
					}
					target = null;
					source = null;
					switch(currentData.pump2to3){
						case 1 : 
							source = 'level2';
							target = 'level3';
							break;
						
						case -1 : 
							source = 'level3';
							target = 'level2';
							break;
					}
					if(currentData[target] <= (280-flow) && currentData[source] >= flow){
						currentData[target] += flow;
						currentData[source] -= flow; 
					}
					lastLevelChange = now;
				}	
			}
	};
	
	var	calculateSenors = function(){
			if(currentData['level1'] >= 10){
				currentData['level1Low'] = true;
				currentData['level1High'] = false;
				if(currentData['level1'] >= 260){
					currentData['level1High'] = true;
				}
			} else {
				currentData['level1Low'] = false;
				currentData['level1High'] = false;
			}
		
			if(currentData['level2'] >= 100){
				currentData['level2Low'] = true;
				currentData['level2High'] = false;
				if(currentData['level2'] >= 260){
					currentData['level2High'] = true;
				}
			} else {
				currentData['level2Low'] = false;
				currentData['level2High'] = false;
			}
		
			if(currentData['level3'] >= 50){
				currentData['level3Low'] = true;
				currentData['level3High'] = false;
				if(currentData['level3'] >= 150){
					currentData['level3High'] = true;
				}
			} else {
				currentData['level3Low'] = false;
				currentData['level3High'] = false;
			}
	};
	var simulate = function(){
		if(simulationActive == true){
			calculateLevels();
			calculateSenors();
			if(callbackFunction){
				callbackFunction(currentData);
			}
			setTimeout(simulate, 500);
		}
	};
	
	return {
		init : function(){
			currentData.level1 = Math.floor(Math.random()*100) + 50;
			currentData.level2 = Math.floor(Math.random()*100) + 100;
			currentData.level3 = levelSum - currentData.level1 - currentData.level2;
			// start to pump from tank 1 to 2
			this.setValues(1, 3);
			
		},
		setCallback : function(cb){
			callbackFunction = cb;
		},
		setValues : function(source, target){
			
			currentData['pump1to2'] = 0;
			currentData['pump1to3'] = 0;
			currentData['pump2to3'] = 0;
			
			if(source == 1){
				if(target == 2)
					currentData['pump1to2'] = 1;
				else if(target == 3)
					currentData['pump1to3'] = 1;
			}
			else if(source == 2){
				if(target == 1)
					currentData['pump1to2'] = -1;
				else if(target == 3)
					currentData['pump2to3'] = 1;
			}
			else if(source == 3){
				if(target == 1)
					currentData['pump1to3'] = -1;
				else if(target == 2)
					currentData['pump2to3'] = -1;
			}
				
		},
		startSimulation: function(){
			lastPoll = new Date();
			simulationActive = true;
			simulate();
		},
		stopSimulation: function(){
			simulationActive = false;
		}
	};
}