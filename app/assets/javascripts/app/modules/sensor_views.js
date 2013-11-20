SensorApp.module("SensorViews", function(SensorViews, App, Backbone, Marionette, $, _) {

  // Main Sensor module layout
  this.SensorLayout = Marionette.Layout.extend({
    template: "app/templates/sensors/index",

    regions: {
      nav: "#nav",
      content: "#content"
    }
  });

  this.SensorPreview = Marionette.ItemView.extend({
    template: "app/templates/sensors/sensor",
    tagName: "li",
    className: "list-item sensor-list-item"
  });

  this.SensorListView = Marionette.CollectionView.extend({
    itemView: this.SensorPreview,
    tagName: "ul",
    id: "sensor-list",
    className: "sensor-list"
  });
});
