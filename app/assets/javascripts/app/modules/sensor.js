SensorApp.module("Sensor", function(Sensor, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  // Module model and collection
  this.SensorModel = Backbone.Model.extend({ 
    defaults: {
      types: ["solar", "wind"]
    }
  });
  this.SensorCollection = Backbone.Collection.extend({
    model: Sensor.SensorModel,
    url: "/api/v1/sensors"
  });

  // Router
  this.Router = Marionette.AppRouter.extend({
    controller: Sensor.Controller,
    appRoutes: {
      "": "index",
      "sensors": "index",
      "sensors/:id": "show",
      "sensors/:id/edit": "edit"
    }
  });

  // Controller (Mediator pattern)
  this.Controller = {

    start: function(options) {
      if (options && options.config.bootstrap) {
        if (!options.models) throw new Error("A model array must be specified");
        this.collection = new Sensor.SensorCollection(options.models);
      }
      else {
        this.collection = new Sensor.SensorCollection();
        this.collection.fetch();
      }
      this._initlayout();
    },

    _initlayout: function() {
      this.layout = new App.SensorViews.SensorLayout();
      App.mainRegion.show(this.layout);
    },

    index: function() {
      var view = new App.SensorViews.SensorListView({ collection: this.collection });

      App.vent.on("sensor:show", function(id) {
        Backbone.history.navigate("/sensors/"+id, true);
      });

      this.layout.contentRegion.show(view);
    },

    _showSensorView: function(id) {
      var model = this.collection.get(id),
          view;
      if (!model) {
        view = new App.SensorViews.NotFoundSensorView();
      }
      else {
        view = new App.SensorViews.SensorView({ model: model });
      }
      return view;
    },

    show: function(id) {
      var view = this._showSensorView(id);
      this.layout.contentRegion.show(view);
    },

    _editSensorView: function(id) {
      var model = this.collection.get(id),
          view;
      if (!model) {
        view = new App.SensorViews.NotFoundSensorView();
      }
      else {
        view = new App.SensorViews.EditSensorView({ model: model });
      }
      return view;
    },

    edit: function(id) {
      var view = this._editSensorView(id);
      view.model.on("sync", function() {
        Backbone.history.navigate("/", true);
      });
      this.layout.contentRegion.show(view);
    }
  };

  // Initialization
  this.on("before:start", function(options) {
    if (options && options.config && options.config.bootstrap) {
      this.Controller.start(options);
    }
    else {
      this.Controller.start();
    }
  });

  this.on("start", function(options) {
    var sensorController = this.Controller;
    new Sensor.Router({
      controller: sensorController
    });
  });

});
