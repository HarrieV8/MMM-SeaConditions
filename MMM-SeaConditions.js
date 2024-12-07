Module.register("MMM-SeaConditions", {

  defaults: {
    lat: "52.1107",                 // latlon for North Sea Scheveningen beach
    lon: "4.2626",                  // in string format for url
    reloadInterval: 60*60*24*1000,  // refresh every 24 hours (measured in msec)
	  units: "C"                      // show temps in degrees Celcius
  },

  /**
   * Apply the default styles.
   */
  
  getStyles() {
    return ["seaconditions.css"]
  },

  start() {
    setInterval(() => {
      this.getContent();
    }, this.config.reloadInterval);
  },

  /**
   * Render page we're on.
   */
  getDom() {  /* nog aanpassen */
    const wrapper = document.createElement("div")
    wrapper.innerHTML = `<b>Title</b><br />${this.templateContent}`

    return wrapper
  },

  addRandomText() {
    this.sendSocketNotification("GET_RANDOM_TEXT", { amountCharacters: 15 })
  },

  /**
   * This is the place to receive notifications from other modules or the system.
   *
   * @param {string} notification The notification ID, it is preferred that it prefixes your module name
   * @param {number} payload the payload type.
   */
  notificationReceived(notification, payload) {
    if (notification === "TEMPLATE_RANDOM_TEXT") {
      this.templateContent = `${this.config.exampleContent} ${payload}`
      this.updateDom()
    }
  }
})
