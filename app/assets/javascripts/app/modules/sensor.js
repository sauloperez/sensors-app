SensorApp.module("Sensor", function(Sensor, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

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
      if (options && options.models) {
        this._showSensorList(options.models);
      }
      else {
        this._showSensorList();
      }
    },

    _showSensorList: function(models) {
      var collection, view;
      if (models) {
        collection = new App.Sensor.SensorCollection(models);
        view = new App.SensorViews.SensorListView({ collection: collection });
      }
      else {
        view = new App.SensorViews.SensorListView();
      }

      var layout = new App.SensorViews.SensorLayout();
      App.mainRegion.show(layout);

      layout.contentRegion.show(view);
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
