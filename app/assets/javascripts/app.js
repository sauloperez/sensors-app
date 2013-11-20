SensorApp = (function(Backbone, Marionette) {
  "use strict";

  // Integrate JST into Marionette
  // Read more: https://github.com/marionettejs/backbone.marionette/wiki/Using-jst-templates-with-marionette
  Backbone.Marionette.Renderer.render = function(template, data){
    if (!JST[template]) throw "Template '" + template + "' not found!";
    return JST[template](data);
  }

  var App = new Marionette.Application();

  App.addRegions({
    headerRegion: '#header',
    mainRegion: '#main'
  });

  App.addInitializer(function() {
    console.log("init");
  });

  App.on("start", function(options){
    console.log(options);
  });

  return App;
})(Backbone, Marionette);
