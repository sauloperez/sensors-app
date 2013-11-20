SensorApp.module("Sensor", function(Sensor, App, Backbone, Marionette, $, _) {

  this.Router = Marionette.AppRouter.extend({
    before: function () {
      App.startSubApp("Sensor", {});
    },

    appRoutes: {

    }
  });

  this.Controller = {
    start: function() {
      this._showSensorList();
    },

    _showSensorList: function() {
      var layout = new App.SensorViews.SensorLayout();
      App.mainRegion.show(layout);
    }
  };

  // Initialization
  this.on("start", function() {
    this.Controller.start();
  });

  this.addInitializer(function () {
    var sensorController = Sensor.Controller;
    new Sensor.Router({
      controller: sensorController
    });
  });

});
