
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
	
	var readValues = false;
	var callbackFunction;
	
	var readValuesPeriodically = function(){
		if(readValues == true){
			sendSoapReadMessage();
			if(callbackFunction){
				callbackFunction(currentData);
			}
			setTimeout(readValuesPeriodically, 500);
		}
	};
	
	// URL of the proxy that is embedded into the tomcat and thus runs on localhost
	var proxyUrl = 'http://localhost:8080/processVisualization/services/OpcXmlDaProxy?method=myOpcXmlDaProxy';
	// URL of the OPC XML DA server that delivers the values
	var xmldaUrl = 'http://141.30.154.211:8087/OPC/DA';
	
	
	// returns the SOAP message that can be used to read the process values
	var getSoapReadMessage = function(){
		var soapMessage =  '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" ' +
			'                   xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" ' +
			'                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + 
			'                   xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
			'  <SOAP-ENV:Header>' +
			'    <TargetService xmlns="http://tu-dresden.de/ifa/">' + xmldaUrl + '</TargetService>' +
			'  </SOAP-ENV:Header>' +	
			'  <SOAP-ENV:Body>' +
			'    <m:Read xmlns:m="http://opcfoundation.org/webservices/XMLDA/1.0/">' +
			'      <m:Options ReturnErrorText="false" ReturnDiagnosticInfo="false" ReturnItemTime="false" ReturnItemPath="false" ReturnItemName="true"/>' +
			'      <m:ItemList>' +
			'        <m:Items ItemName="Schneider/Fuellstand1_Ist"/>' +
			'        <m:Items ItemName="Schneider/Fuellstand2_Ist"/>' +
			'        <m:Items ItemName="Schneider/Fuellstand3_Ist"/>' +
			'        <m:Items ItemName="Schneider/LH1"/>' +
			'        <m:Items ItemName="Schneider/LH2"/>' +
			'        <m:Items ItemName="Schneider/LH3"/>' +
			'        <m:Items ItemName="Schneider/LL1"/>' +
			'        <m:Items ItemName="Schneider/LL2"/>' +
			'        <m:Items ItemName="Schneider/LL3"/>' +
			'      </m:ItemList>' +
			'    </m:Read>' +
			'  </SOAP-ENV:Body>' +
			'</SOAP-ENV:Envelope>';
		return soapMessage;
	}

	// evaluates the read response sent by the OPC XML DA server
	var getDataFromReadResponse = function(response){
		var data = {};
		var retItems = response.getElementsByTagName('Items');
		data.level1 = retItems[0].firstChild.firstChild.nodeValue; 
		data.level2 = retItems[1].firstChild.firstChild.nodeValue; 
		data.level3 = retItems[2].firstChild.firstChild.nodeValue;
		data.level1High = retItems[3].firstChild.firstChild.nodeValue;
		data.level2High = retItems[4].firstChild.firstChild.nodeValue;
		data.level3High = retItems[5].firstChild.firstChild.nodeValue;
		data.level1Low = retItems[6].firstChild.firstChild.nodeValue;
		data.level2Low = retItems[7].firstChild.firstChild.nodeValue;
		data.level3Low = retItems[8].firstChild.firstChild.nodeValue;
		currentData =  data;
	};
	
	// sends the SOAP read message via Ajax
	var sendSoapReadMessage = function(){
		/* Put your code here ... (Aufgabe 4) */
		//call of the jQuery ajax function ( $.ajax(...) )
	}
	
	// returns the SOAP message that can be used to write process values
	var getSoapWriteMessage = function(from, to){
		var soapMessage =  '<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" ' +
			'                   xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" ' +
			'                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' + 
			'                   xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
			'  <SOAP-ENV:Header>' +
			'    <TargetService xmlns="http://tu-dresden.de/ifa/">' + xmldaUrl + '</TargetService>' +
			'  </SOAP-ENV:Header>' +	
			'  <SOAP-ENV:Body>' +
			'    <m:Write xmlns:m="http://opcfoundation.org/webservices/XMLDA/1.0/">' +
			'      <m:Options ReturnErrorText="true" ReturnDiagnosticInfo="true" ReturnItemTime="true" ReturnItemPath="true" ReturnItemName="true"/>' +
			'      <m:ItemList>' +
			'        <m:Items ItemName="Schneider/Behaelter_A_FL">' +
			'		   <m:Value xsi:type="xsd:int">' + from + '</m:Value>' +
			'		 </m:Items>' +
			'        <m:Items ItemName="Schneider/Behaelter_B_FL">' +
			'		   <m:Value xsi:type="xsd:int">' + to + '</m:Value>' +
			'		 </m:Items>' +
			'        <m:Items ItemName="Schneider/Start_Umpumpen_FL">' +
			'		   <m:Value xsi:type="xsd:boolean">0</m:Value>' +
			'		 </m:Items>' +
			'      </m:ItemList>' +
			'    </m:Write>' +
			'  </SOAP-ENV:Body>' +
			'</SOAP-ENV:Envelope>';
		return soapMessage;
	}
	
	// sends the SOAP write message visa Ajax
	var sendSoapWriteMessage = function(from, to){
		/* Put your code here ... (Aufgabe 5) */
		//call of the jQuery ajax function ( $.ajax(...) )
	}
	
	return {
		init : function(){ /* nothing to be done */ },
		setCallback : function(cb){
			callbackFunction = cb;
		},
		setValues : function(source, target){
			sendSoapWriteMessage(source, target);
		},
		startSimulation: function(){
			readValues = true;
			readValuesPeriodically();
		},
		stopSimulation: function(){
			readValue = false;
		}
	};
}