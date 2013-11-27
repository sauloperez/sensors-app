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

  this.NotFoundSensorView = Marionette.ItemView.extend({
    template: "app/templates/sensors/not_found",
    tagName: "div",
    className: "no-data not-found"
  });

  this.SensorView = Marionette.ItemView.extend({
    template: "app/templates/sensors/show",
    tagName: "div",
    className: "sensor"
  });

  this.EditSensorView = Marionette.ItemView.extend({
    template: "app/templates/sensors/edit",
    tagName: "div",
    className: "edit-sensor",

    events: {
      "submit form": "saveSensor"
    },

    ui: {
      latitude: '#sensor-latitude',
      longitude: '#sensor-longitude',
      type: '#sensor-type',
      // Cache radio buttons container
      active: '#sensor-active',
    },

    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },

    _getActiveValue: function($el) {
      return $('input[name=sensor-active]:checked').val() === 'Yes';
    },

    saveSensor: function(event) {
      event.preventDefault();
      this.model.set('latitude', parseFloat(this.ui.latitude.val()));
      this.model.set('longitude', parseFloat(this.ui.longitude.val()));
      this.model.set('type', this.ui.type.val());
      this.model.set('active', this._getActiveValue(this.ui.active));
      this.model.save();
    }
  });

  this.SensorPreview = Marionette.ItemView.extend({
    template: "app/templates/sensors/preview",
    tagName: "li",
    className: "list-item sensor-list-item",

    ui: {
      deleteButton: ".delete",
      mainAction: ".main-action"
    },

    events: {
      "click .list-item-data": "showSensor",
      "click .confirm-deletion": "confirmDeletion",
      "click .delete": "deleteSensor"
    },

    showSensor: function(event) {
      var selectedItem = $(event.currentTarget);
      App.vent.trigger("sensor:show", selectedItem.parent().data("id"));
    },

    deleteSensor: function(event) {
      this.model.destroy();
      this.remove();
    },

    confirmDeletion: function() {
      var self = this;
      this.ui.deleteButton.removeClass('hidden');
      this.ui.deleteButton.on("mouseout", function() {
        self.toggleDelete();
      });
    },

    toggleDelete: function() {
      if (this.ui.deleteButton.is(':visible')) {
        this.ui.deleteButton.toggleClass('hidden');
      }
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
