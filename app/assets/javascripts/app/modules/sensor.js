SensorApp.module("Sensor", function(Sensor, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  // Module model and collection
  this.SensorModel = Backbone.Model.extend({ 
    defaults: {
      types: ["solar", "wind"]
    },

    validate: function(attrs, options) {
      var errors = {},
          whiteList = ['latitude', 'longitude', 'type', 'active'];

      attrs = _.pick(attrs, whiteList);

      // Initialize hash of arrays
      _.each(attrs, function(value, attr) {
        errors[attr] = [];
      });

      // Deal with blank fields
      _.each(attrs, function(value, field) {
        if (!value && field !== "active") {
          errors[field].push("can't be blank");
        }
      });

      // Deal with business logic
      if (isNaN(attrs.latitude)) {
        errors['latitude'].push("is not a number");
      }
      if (isNaN(attrs.longitude)) {
        errors['longitude'].push("is not a number");
      }
      if (!_.contains(this.defaults.types, attrs.type)) {
        errors['type'].push("is not included in the list");
      }
      if (typeof attrs.active !== "boolean") {
        errors['active'].push("is not Yes or No");
      }

      // Return errros if any
      var ret = {};
      _.each(errors, function(array, field) {
        if (!!array.length) {
          ret[field] = array;
        }
      });
      if (!_.isEmpty(ret)) return ret;
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
      "sensors/create": "create",
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
      var headerView = new App.SensorViews.SensorListHeaderView(),
          contentView = new App.SensorViews.SensorListView({ collection: this.collection });

      App.vent.on("sensor:show", function(id) {
        console.log("sensor:show called");
        Backbone.history.navigate("/sensors/"+id, true);
      });
      App.vent.on("sensor:create", function() {
        console.log("sensor:create called");
        Backbone.history.navigate("/sensors/create", true);
      });

      this.layout.headerRegion.show(headerView)
      this.layout.contentRegion.show(contentView);
    },

    _getShowSensorView: function(id) {
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
      var contentView = this._getShowSensorView(id);
          headerView = new App.SensorViews.SensorHeaderView({
            model: this.collection.get(id)
          }),
      this.layout.headerRegion.show(headerView);
      this.layout.contentRegion.show(contentView);
    },

    _getFormSensorView: function(id) {
      var view,
          self = this,
          model = this.collection.get(id);
          
      if (!model) { // We'll create it
        view = new App.SensorViews.SensorFormView({ 
          collection: self.collection
        });
      }
      else { // We'll save it if needed
        view = new App.SensorViews.SensorFormView({ model: model });
      }
      return view;
    },

    edit: function(id) {
      var contentView = this._getFormSensorView(id),
          headerView = new App.SensorViews.SensorHeaderView({
            model: this.collection.get(id)
          });

      contentView.model.on("sync", function() {
        Backbone.history.navigate("/", true);
      });
      this.layout.headerRegion.show(headerView);
      this.layout.contentRegion.show(contentView);
    },

    create: function() {
      var self = this,
          headerView = new App.SensorViews.SensorHeaderView(),
          contentView = this._getFormSensorView();

      this.collection.on("sync", function() {
        Backbone.history.navigate("/", true);
      });
      this.layout.headerRegion.show(headerView)
      this.layout.contentRegion.show(contentView);
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
