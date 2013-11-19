SensorApp = (function(Backbone, Marionette) {
  "use strict";

  var App = new Marionette.Application();

  App.addInitializer(function() {
    console.log("init");
  });

  App.on("start", function(options){
    console.log(options);
  });

  return App;
})(Backbone, Marionette);
