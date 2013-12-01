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
    url: "/api/v1/sensors",

    filterBy: function(filters) {
      return this.where(filters);
    }
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

      // We keep a mirror collection to host the results of the filters
      this._setFilteredCollection(this.collection.models);
      this._initLayout();
      this._setEventHandlers();
    },

    index: function() {
      var self = this,
          headerView = new App.SensorViews.SensorListHeaderView(),
          contentView = new App.SensorViews.SensorListView({ 
            collection: this.filteredCollection 
          });

      this._updateLayout(headerView, contentView);
      this._showFilters();
    },

    show: function(id) {
      var contentView = this._getShowSensorView(id);
          headerView = new App.SensorViews.SensorHeaderView({
            model: this.filteredCollection.get(id)
          }),
      
      this._updateLayout(headerView, contentView);
      this._hideFilters();
    },

    edit: function(id) {
      var contentView = this._getFormSensorView(id),
          headerView = new App.SensorViews.SensorHeaderView({
            model: this.filteredCollection.get(id)
          });

      contentView.model.on("sync", function() {
        Backbone.history.navigate("/", true);
      });
      
      this._updateLayout(headerView, contentView);
      this._hideFilters();
    },

    create: function() {
      var self = this,
          headerView = new App.SensorViews.SensorHeaderView(),
          contentView = this._getFormSensorView();

      this._updateLayout(headerView, contentView);      
      this._hideFilters();
    },

    filterBy: function(filter) {
      var filteredModels = this.collection.models;

      if (_.isEmpty(filter)) {
        this.currentFilter = {};
        this.filteredCollection.reset(filteredModels);
        return;
      }
      else {
        this.currentFilter = filter;
        filteredModels = this.collection.filterBy(filter);
      }
      this.filteredCollection.reset(filteredModels);
    },

    _setFilteredCollection: function(models) {
      var self = this;
      this.currentFilter = {};
      this.filteredCollection = new Sensor.SensorCollection(models);

      // Keep both collections synchronized
      // filteredCollection acts as a proxy of the unfiltered collection (this.collection)
      this.filteredCollection.on("add", function(sensor) {
        self.collection.add(sensor);
        // May be the case that the recenlty added model should not be shown for the current filter
        self.filterBy(self.currentFilter);
      });
      this.filteredCollection.on("change", function(sensor) {
        // May be the case that the recenlty changed model should not be shown for the current filter
        self.filterBy(self.currentFilter);
      });
      this.filteredCollection.on("remove", function(sensor) {
        self.collection.remove(sensor);
      });
    },

    _initLayout: function() {
      this.layout = new App.SensorViews.SensorLayout();
      App.mainRegion.show(this.layout);
    },

    _setEventHandlers: function() {
      App.vent.on("sensor:show", function(id) {
        Backbone.history.navigate("/sensors/" + id, true);
      });
      App.vent.on("sensor:create", function() {
        Backbone.history.navigate("/sensors/create", true);
      });
      this.collection.on("sync", function() {
        Backbone.history.navigate("/", true);
      });
    },

    _updateLayout: function(headerView, contentView) {
      this.layout.headerRegion.show(headerView);
      this.layout.contentRegion.show(contentView);
    },

    _showFilters: function() {
      var self = this;

      App.SensorFilters.start({ 
        collection: this.filteredCollection,
        region: this.layout.navRegion,
        currentFilter: this.currentFilter 
      });

      App.vent.on("sensor:filter:active", function(filter) {
        self.filterBy(filter);
      });
      App.vent.on("sensor:filter:type", function(filter) {
        self.filterBy(filter);
      });
      App.vent.on("sensor:filter:all", function() {
        self.filterBy();
      });
    },

    _getShowSensorView: function(id) {
      var model = this.filteredCollection.get(id);
      if (!model) {
        return new App.SensorViews.NotFoundSensorView();
      }
      return new App.SensorViews.SensorView({ model: model });
    },

    _hideFilters: function() {
      App.SensorFilters.stop();
      this.layout.navRegion.close();
    },

    _getFormSensorView: function(id) {
      // If the model does not exist we'll create it within the collection
      var model = this.filteredCollection.get(id),
          options = (!model) ? {collection: this.filteredCollection} : {model: model};
      return new App.SensorViews.SensorFormView(options);
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
