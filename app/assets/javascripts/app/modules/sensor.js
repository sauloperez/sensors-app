SensorApp.module("Sensor", function(Sensor, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  this.Router = Marionette.AppRouter.extend({
    controller: Sensor.Controller,
    appRoutes: {
      "": "index"
    }
  });

  this.SensorModel = Backbone.Model.extend({ });
  this.SensorCollection = Backbone.Collection.extend({
    model: Sensor.SensorModel
  });

  // Controller (Mediator pattern)
  this.Controller = {

    start: function(options) {
      if (options && options.config.bootstrap) {
        if (!options.models) throw new Error("A model array must be specified");
        this.collection = new Sensor.SensorCollection(options.models);
      }
    },

    index: function() {
      var view = new App.SensorViews.SensorListView({ collection: this.collection }),
          layout = new App.SensorViews.SensorLayout();

      App.mainRegion.show(layout);
      layout.contentRegion.show(view);
    }
  };

  // Initialization
  this.on("before:start", function(options) {
    if (options && options.config && options.config.bootstrap) {
      this.Controller.start(options);
    }
  });

  this.on("start", function(options) {
    var sensorController = this.Controller;
    new Sensor.Router({
      controller: sensorController
    });
  });

});
