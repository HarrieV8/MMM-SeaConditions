
/*
MagicMirror² Module: MMM-SeaConditions
https://github.com/HarrieV8/MMM-SeaConditions
version 1.0
MIT Licensed
*/


Module.register("MMM-SeaConditions", {

  defaults: {
    apiKey: '',
    lat: "52.1107",                 // latlon for North Sea Scheveningen beach
    lon: "4.2626",                  // in string format for url
    reloadInterval: 60*60*24*1000,  // refresh every 24 hours (measured in msec)
	units: "C",                   	// show temps in degrees Celcius
    height: "250px",				// set module height 

  },

  styles: {}, // Property to store styles

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
        this.getContent(); //re load, 1 second delay is needed!
      }, 1000);
    }, this.config.reloadInterval);
  },

   // Create the DOM for this module
   getDom () {
    const outerDiv = document.createElement('div');
	setTimeout(() => {
        this.styles = window.getComputedStyle(outerDiv); // get css style properties for outerDiv
    }, 100); // small delay to ensure the element is rendered
    outerDiv.id = 'plotly-graph'; // Optional, for easy id
    outerDiv.style.height = this.config.height;
    this.outerDiv = outerDiv;
    return outerDiv;
  },

  notificationReceived (notification) {
    if (notification === "ALL_MODULES_STARTED") {
      setTimeout(() => {
        this.getContent(); //first load, 1 second delay is needed!
      }, 1000);
    }
  },

  /**
   * Render page we're on.
   */

  getContent: async function() { //get temps from API and display in plotly bar graph
	const baseURL = 'https://sea-surface-temperature.p.rapidapi.com/current?latlon=';
    const lat = this.config.lat;
    const lon = this.config.lon;
		const options = {
				method: 'GET',
				headers: {
					'x-rapidapi-key': this.config.apiKey,
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

    	const colorful = ['grey','grey','grey','gold','white','white','white'];
   		const mmcolorscheme = colorful;
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
			family: this.styles.getPropertyValue("font-family"),
			size: parseFloat(this.styles.getPropertyValue("font-size")),
			color: this.styles.getPropertyValue("color"),
		}, 
		xaxis: {
			visible: true,
			zeroline: true,
            range: [-0.6, data[0].x.length - 0.65],
			type: 'category', //prevent formatting of date labels
			tickfont: {
				color: mmcolorscheme,
				size: parseFloat(this.styles.getPropertyValue("font-size")),
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
