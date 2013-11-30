SensorApp.module("SensorFilters", function(SensorFilters, App, Backbone, Marionette, $, _) {
  this.startWithParent = false;

  this.SensorFiltersView = Marionette.ItemView.extend({
    template: "app/templates/sensor_filters/filters",
    tagName: "div",
    className: "sensor-filters",

    events: {
      "click #filter-active": "filterByActive",
      "click #filter-inactive": "filterByInactive",
      "click #filter-all": "filterByAll"
    },

    ui: {
      active: "#filter-active",
      inactive: "#filter-inactive",
      all: "#filter-all",
    },

    initialize: function() {
      this.selectedFilter = this.options.selectedFilter || "all";

      // Update the UI on collection resets
      this.listenTo(this.collection, "reset", this.updateCurrentButton);
    },

    onRender: function() {
      this.updateCurrentButton();
    },

    updateCurrentButton: function() {
      _.each(this.ui, function($button) {
        $button.removeClass("current");
      });
      this.ui[this.selectedFilter].addClass("current");
    },

    filterByActive: function() {
      this.selectedFilter = "active";
      App.vent.trigger("sensor:filter:active");
    },

    filterByInactive: function() {
      this.selectedFilter = "inactive";
      App.vent.trigger("sensor:filter:inactive");
    },

    filterByAll: function() {
      this.selectedFilter = "all";
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