
/*
MagicMirror² Module: MMM-SeaConditions
https://github.com/HarrieV8/MMM-SeaConditions
MIT Licensed
*/


Module.register("MMM-SeaConditions", {

  defaults: {
    apikey: "",
    lat: "52.1107",                 // latlon for North Sea Scheveningen beach
    lon: "4.2626",                  // in string format for url
    reloadInterval: 60*60*24*1000,  // refresh every 24 hours (measured in msec)
	  units: "C",                      // show temps in degrees Celcius
    height: 250,
    width: 600,                      // hack, fix in custom.css later
  },

  getScripts: function() {
    return [
      'https://cdn.plot.ly/plotly-2.35.2.min.js'      // plotly library from plotlyt server
    ]
  },

  start: function()  {
    Log.log("Starting module: " + this.name);
    console.log(this.outerDiv) 

    setInterval(() => {
      setTimeout(() => {
        this.getContent(); //re load with 1 second delay
      }, 1000);
    }, this.config.reloadInterval);
  },

   // Create the DOM for this module
   getDom () {
    const outerDiv = document.createElement('div');
    outerDiv.id = 'plotly-graph'; // Optional, for easy id
    outerDiv.style.width = this.config.width + "px";
    outerDiv.style.height = this.config.height + "px";
    this.outerDiv = outerDiv;
    return outerDiv;
  },

  notificationReceived (notification) {
    if (notification === "ALL_MODULES_STARTED") {
      setTimeout(() => {
        this.getContent(); //initial load with 1 second delay
      }, 1000);
    }
  },

  /**
   * Render page we're on.
   */


/*
  getContent: function()  {//display API output in plotly.js bar graph test function
    
    const temps = [{"date": "20241122","tempC": 11.64,"tempF": 52.95}, 
      {"date": "20241123","tempC": 11.44,"tempF": 52.59}, 
      {"date": "20241124","tempC": 11,"tempF": 52.45}, 
      {"date": "20241125","tempC": 9,"tempF": 60}, 
      {"date": "20241126","tempC": 7,"tempF": 52.25}, 
      {"date": "20241127","tempC": 11.18,"tempF": 40.12},
      {"date": "20241128","tempC": 10.5,"tempF": 51.85}];

    const colorful = ['grey','grey','grey','gold','white','white','white'];
    const mmcolorscheme = colorful;
    const mmfsize = 16;
    const marginleft = 25;
    const marginright = 0;

   	var xValues = [];   // x-axis will hold dates
   	var yValues = []; // y-axis will hold temps
 
   	for(i = 0; i < temps.length; i++) { // put data in x- and y-axis		 
   		xValues.push(temps[i].date.slice(6,8).concat("-", temps[i].date.slice(4,6))); // change date format
   		if (this.config.units == 'C') {  
			yValues.push(Math.round(temps[i].tempC * 10) / 10); //Celcius round to 1 decimal
		} else {
			yValues.push(Math.round(temps[i].tempF * 10) / 10); //Fahrenheit round to 1 decimal
		}
	}
	xValues.splice(3,1,"today"); //replace 4th label for "today", see API documentation
   	Log.log(xValues); // test purpose
   	Log.log(yValues);
	
	if (this.config.units == 'F') {  // get y-axis range min and max
		var minY = 35;
	} else {
		var minY = 0;
	}
	const maxY = Math.max(...yValues) + 10;
	
	const data = [{
		type: 'bar',
		x: xValues,
	    y: yValues,
	    text: yValues.map(value => ' ' + String(value) + '°'), // convert yValues to string and add degrees symbol
		textposition: 'outside', // display values above bar
		cliponaxis:false, // prevent clipping of numbers above bars
		textfont: {
		    color: mmcolorscheme,
		},
		hoverinfo: 'none',
		marker: {
			color: mmcolorscheme,
		}
	}];

	const layout = {
		//autosize: false, 
		bargap:0.35,
		barcornerradius: 5,
		paper_bgcolor: 'rgba(0,0,0,0)', //transparant background
  		plot_bgcolor: 'rgba(0,0,0,0)',
		font: {
			family: 'Roboto Condensed, sans-serif',
			size: mmfsize,
			color: 'grey',
            weight: 300, // 300=light, 400=normal, 700=bold
		},
		xaxis: {
			visible: true,
			zeroline: true,
            range: [-0.6, data[0].x.length - 0.65],
			type: 'category', //prevent formatting of date labels
			tickfont: {
				color: mmcolorscheme,
				size: mmfsize,
			},
		},	
		yaxis: {
			showgrid: false,
            side: 'left',
			zeroline: false,
			visible: true,
			showline: true, 
			linewidth:3, 
			linecolor:'grey',
			range: [minY, maxY],
		},
		margin: {
			l: 22,
			r: 0,
			b: 30,
			t: 10,
			pad: 0,
		},
	}; 
			
    const config = {
		displayModeBar: false, // hide toolbar
		staticPlot: true, //make the plot static
		responsive: true,
	};
	
	Plotly.newPlot(this.outerDiv, data, layout, config); // create graph
} //end getContent testfunction without API

*/
  getContent: async function() {
	const baseURL = 'https://sea-surface-temperature.p.rapidapi.com/current?latlon=';
    const lat = this.config.lat;
    const lon = this.config.lon;
		const options = {
				method: 'GET',
				headers: {
					'x-rapidapi-key': this.config.apikey,
					'x-rapidapi-host': 'sea-surface-temperature.p.rapidapi.com',
				}
		};

    try {
      const response = await fetch(`${baseURL}${lat}%2C${lon}`, options);
      if (!response.ok) {
        const message = 'HTTP error! status: ${response.status}';
        throw new Error(message);
      }
      	const temps = await response.json();
      	Log.log(temps); //test purpose

    	const colorful = ['grey','grey','grey','gold','white','white','white'];
   		const mmcolorscheme = colorful;
    	const mmfsize = 16;
    	const marginleft = 25;
    	const marginright = 0;

   		var xValues = [];   // x-axis will hold dates
   		var yValues = []; // y-axis will hold temps
 
   		for(i = 0; i < temps.length; i++) { // put data in x- and y-axis		 
   			xValues.push(temps[i].date.slice(6,8).concat("-", temps[i].date.slice(4,6))); // change date format
   			if (this.config.units == 'C') {  
				yValues.push(Math.round(temps[i].tempC * 10) / 10); //Celcius round to 1 decimal
			} else {
				yValues.push(Math.round(temps[i].tempF * 10) / 10); //Fahrenheit round to 1 decimal
			}
		}
	xValues.splice(3,1,"today"); //replace 4th label for "today", see API documentation
   	Log.log(xValues); // test purpose
   	Log.log(yValues);
	
	if (this.config.units == 'F') {  // get y-axis range min and max
		var minY = 35;
	} else {
		var minY = 0;
	}
	const maxY = Math.max(...yValues) + 10;
	
	const data = [{
		type: 'bar',
		x: xValues,
	    y: yValues,
	    text: yValues.map(value => ' ' + String(value) + '°'), // convert yValues to string and add degrees symbol
		textposition: 'outside', // display values above bar
		cliponaxis:false, // prevent clipping of numbers above bars
		textfont: {
		    color: mmcolorscheme,
		},
		hoverinfo: 'none',
		marker: {
			color: mmcolorscheme,
		}
	}];

	const layout = {
		//autosize: false, 
		bargap:0.35,
		barcornerradius: 5,
		paper_bgcolor: 'rgba(0,0,0,0)', //transparant background
  		plot_bgcolor: 'rgba(0,0,0,0)',
		font: {
			family: 'Roboto Condensed, sans-serif',
			size: mmfsize,
			color: 'grey',
            weight: 300, // 300=light, 400=normal, 700=bold
		},
		xaxis: {
			visible: true,
			zeroline: true,
            range: [-0.6, data[0].x.length - 0.65],
			type: 'category', //prevent formatting of date labels
			tickfont: {
				color: mmcolorscheme,
				size: mmfsize,
			},
		},	
		yaxis: {
			showgrid: false,
            side: 'left',
			zeroline: false,
			visible: true,
			showline: true, 
			linewidth:3, 
			linecolor:'grey',
			range: [minY, maxY],
		},
		margin: {
			l: 22,
			r: 0,
			b: 30,
			t: 10,
			pad: 0,
		},
	}; 
			
    const config = {
		displayModeBar: false, // hide toolbar
		staticPlot: true, //make the plot static
		responsive: true,
	};
	
	Plotly.newPlot(this.outerDiv, data, layout, config); // create graph


    } catch (error) {
          Log.error('Error fetching data:', error);
    }
  },



  /**
   * This is the place to receive notifications from other modules or the system.
   *
   * @param {string} notification The notification ID, it is preferred that it prefixes your module name
   * @param {number} payload the payload type.
   */

});
