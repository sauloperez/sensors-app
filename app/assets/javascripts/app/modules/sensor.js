SensorApp.module("Sensor", function(Sensor, App, Backbone, Marionette, $, _) {

  this.Router = Marionette.AppRouter.extend({
    before: function () {
      App.startSubApp("Sensor", {});
    },

    appRoutes: {

    }
  });

  this.SensorModel = Backbone.Model.extend({ });
  this.SensorCollection = Backbone.Collection.extend({
    model: Sensor.SensorModel
  });

  this.Controller = {
    start: function(options) {
      this._showSensorList(options.models || {});
    },

    _showSensorList: function(models) {
      var layout = new App.SensorViews.SensorLayout();
      App.mainRegion.show(layout);
    }
  };

  // Initialization
  this.on("start", function(options) {
    this.Controller.start(options || {});
  });

  this.addInitializer(function () {
    var sensorController = Sensor.Controller;
    new Sensor.Router({
      controller: sensorController
    });
  });

});
