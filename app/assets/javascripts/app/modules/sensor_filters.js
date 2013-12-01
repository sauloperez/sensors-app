SensorApp.module("SensorFilters", function(SensorFilters, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  this.SensorFiltersView = Marionette.ItemView.extend({
    template: "app/templates/sensor_filters/filters",
    tagName: "div",
    className: "sensor-filters",

    events: {
      "click #filter-active": "filterByActive",
      "click #filter-inactive": "filterByInactive",
      "click #filter-solar": "filterBySolar",
      "click #filter-wind": "filterByWind",
      "click #filter-all": "filterByAll"
    },

    ui: {
      active_true: "#filter-active",
      active_false: "#filter-inactive",
      type_solar: "#filter-solar",
      type_wind: "#filter-wind",
      all: "#filter-all"
    },

    initialize: function() {
      this.selectedFilter = this.options.selectedFilter || { attr: "all" };
      this.listenTo(this.collection, "reset", this.updateCurrentButton);
    },

    onRender: function() {
      this.updateCurrentButton();
    },

    updateCurrentButton: function() {
      var key,
          filter = this.selectedFilter;
      _.each(this.ui, function($button) {
        $button.removeClass("current");
      });
      key = filter.attr + ((filter.value !== undefined) ? "_" + filter.value : "");
      this.ui[key].addClass("current");
    },

    filterByActive: function() {
      this.selectedFilter = { 
        attr: "active",
        value: true
      };
      App.vent.trigger("sensor:filter:active", true);
    },

    filterByInactive: function() {
      this.selectedFilter = { 
        attr: "active",
        value: false
      };
      App.vent.trigger("sensor:filter:active", false);
    },

    filterBySolar: function() {
      this.selectedFilter = { 
        attr: "type",
        value: "solar"
      };
      App.vent.trigger("sensor:filter:type", "solar");
    },

    filterByWind: function() {
      this.selectedFilter = { 
        attr: "type",
        value: "wind"
      };
      App.vent.trigger("sensor:filter:type", "wind");
    },

    filterByAll: function() {
      this.selectedFilter = { attr: "all" };
      App.vent.trigger("sensor:filter:all");
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