SensorApp = (function(Backbone, Marionette) {
  "use strict";

  // Integrate JST into Marionette
  // Read more: https://github.com/marionettejs/backbone.marionette/wiki/Using-jst-templates-with-marionette
  Backbone.Marionette.Renderer.render = function(template, data){
    if (!JST[template]) throw "Template '" + template + "' not found!";
    return JST[template](data);
  }

  var App = new Marionette.Application();

  // Global configuration
  App.config = {
    bootstrap: true
  };

  // Regions
  App.addRegions({
    headerRegion: '#header',
    mainRegion: '#main'
  });

  App.on("start", function(options) {
    // Overwrite the config defaults
    if (options && options.config) {
      _.extend(App.config, options.config);
    }    

    if (App.config.bootstrap) {
      App.Sensor.start(options);
    }
    else {
      App.Sensor.start();
    }
  });

  return App;
})(Backbone, Marionette);
