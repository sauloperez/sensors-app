SensorApp.module("SensorFilters", function(SensorFilters, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  this.SensorFiltersView = Marionette.ItemView.extend({
    template: "app/templates/sensor_filters/filters",
    tagName: "div",
    className: "sensor-filters",

    events: {
      "click .filter-button": "filterBy" 
    },

    ui: {
      active_true: "#filter-active",
      active_false: "#filter-inactive",
      type_solar: "#filter-solar",
      type_wind: "#filter-wind",
      all: "#filter-all"
    },

    initialize: function() {
      this.selectedFilter = this.options.selectedFilter || {};
      this.listenTo(this.collection, "reset", this.updateCurrentButton);
    },

    onRender: function() {
      this.updateCurrentButton();
    },

    updateCurrentButton: function() {
      var key = "all",
          filter = this.selectedFilter;

      _.each(this.ui, function($button) {
        $button.removeClass("current");
      });

      _.each(filter, function(value, attr) {
        key = attr + ((value !== undefined) ? "_" + value : "");
      });
      this.ui[key].addClass("current");
    },

    // It accepts either an event object or an attr-value hash
    filterBy: function(options) {
      var $button, attr, value;
      this.selectedFilter = {};
      
      if (options) {
        // An event is passed in
        if (options.currentTarget) {
          $button = $(options.currentTarget);
          attr = $button.data("filter-attr");
          value = $button.data("filter-value");
        }
        // A hash is passed in
        else {
          attr = _.keys(options)[0];
          value = options[attr];
        }
      }

      // Case 'all'. Don't apply any filter
      if (attr === "all" || !options) {
        App.vent.trigger("sensor:filter:all");
        return;
      }

      this.selectedFilter[attr] = value;
      App.vent.trigger("sensor:filter:" + attr, this.selectedFilter);
    }
  });


  this.Controller = {

    start: function(options) {
      if (!options.collection) throw new Error("A collection must be passed in");
      if (!options.region) throw new Error("A region to render in must be specified");

      this.collection = options.collection;
      this.region = options.region;
      this.currentFilter = options.currentFilter;
    },

    showFilters: function() {
      var self = this,
          view = new SensorFilters.SensorFiltersView({
            collection: self.collection,
            selectedFilter: this.currentFilter
          });
      this.region.show(view);
    },
  };

  // Initialization
  this.on("before:start", function(options) {
    this.Controller.start(options);
  });

  this.on("start", function() {
    this.Controller.showFilters();
  });

});