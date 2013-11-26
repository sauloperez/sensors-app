SensorApp.module("SensorViews", function(SensorViews, App, Backbone, Marionette, $, _) {

  // Main Sensor module layout
  this.SensorLayout = Marionette.Layout.extend({
    template: "app/templates/sensors/layout",
    className: "sensor-layout",

    regions: {
      navRegion: "#nav",
      contentRegion: "#content"
    }
  });

  this.SensorView = Marionette.ItemView.extend({
    template: "app/templates/sensors/show",
    tagName: "div",
    className: "sensor"
  });

  this.SensorPreview = Marionette.ItemView.extend({
    template: "app/templates/sensors/preview",
    tagName: "li",
    className: "list-item sensor-list-item",

    events: {
      "click .list-item-data": "show"
    },

    show: function(event) {
      var selectedItem = $(event.currentTarget);
      App.vent.trigger("sensor:show", selectedItem.data("id"));
    }
  });

  this.NoSensorItemsView = Marionette.ItemView.extend({
    template: "app/templates/sensors/no_items",
    className: "no-items no-sensor-items"
  });

  this.SensorListView = Marionette.CollectionView.extend({
    tagName: "ul",
    id: "sensor-list",
    className: "sensor-list",
    itemView: this.SensorPreview,
    emptyView: this.NoSensorItemsView
  });
});
