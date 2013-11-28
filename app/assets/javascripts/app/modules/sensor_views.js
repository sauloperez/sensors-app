SensorApp.module("SensorViews", function(SensorViews, App, Backbone, Marionette, $, _) {

  // Main Sensor module layout
  this.SensorLayout = Marionette.Layout.extend({
    template: "app/templates/sensors/layout",
    className: "sensor-layout",

    regions: {
      headerRegion: "#sensor-header",
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

  this.SensorFormView = Marionette.ItemView.extend({
    template: "app/templates/sensors/form",
    tagName: "div",
    className: "edit-sensor",

    events: {
      "submit form": "saveSensor"
    },

    ui: {
      latitude: '#sensor-latitude',
      longitude: '#sensor-longitude',
      type: '#sensor-type',
      active: '#sensor-active', // It just caches radio buttons container
    },

    initialize: function() {
      if (!this.model) {
        // The sensor types are listed in the SensorModel defaults
        this.model = new App.Sensor.SensorModel({});
      }
    },

    _getActiveValue: function($el) {
      return $('input[name=sensor-active]:checked').val() === 'Yes';
    },

    _displayError: function(field, errors) {
      var $parent = this.ui[field].parent();
      if (field === "active") {
        $parent = this.ui[field];
      }

      $parent.addClass('has-error')
      _.each(errors, function(error) { 
        $("<span class='error help-block'/>")
          .text(error)
          .appendTo($parent); 
      });
    },

    _displayErrors: function(errors) {
      var self = this;
      _.each(errors, function(error, field) {
        self._displayError(field, error);
      });
    },

    saveSensor: function(event) {
      var self = this;
      event.preventDefault();

      formValues = {
        latitude: parseFloat(this.ui.latitude.val()),
        longitude: parseFloat(this.ui.longitude.val()),
        type: this.ui.type.val(),
        active: this._getActiveValue(this.ui.active)
      }

      // Delete any previous errors
      this.$el.find('.error').remove();
      this.$el.find('.has-error').removeClass('has-error');

      // Persist the model
      if (!this.collection) {
        this.model.save(formValues, { error: function(model, xhr, options) {
          var errors = JSON.parse(xhr.responseText);
          self._displayErrors(errors);
        }});  
      }
      // ...or just create a new model within the collection
      else {
        this.collection.create(formValues, { wait: true, 
          error: function(model, xhr, options) {
            var errors = JSON.parse(xhr.responseText);
            self._displayErrors(errors);
          }
        });
      }
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
    className: "no-data no-items no-sensor-items"
  });

  this.SensorHeaderView = Marionette.ItemView.extend({
    template: "app/templates/sensors/header",
    tagName: "div",
    id: "sensor-header",
    className: "header"
  });

  this.SensorListHeaderView = Marionette.ItemView.extend({
    template: "app/templates/sensors/list_header",
    tagName: "div",
    id: "sensor-list-header",
    className: "header",

    events: {
      "click .sensor-add": "createSensor"
    },

    createSensor: function(event) {
      var selectedItem = $(event.currentTarget);
      App.vent.trigger("sensor:create");
    },
  });

  this.SensorListView = Marionette.CollectionView.extend({
    tagName: "ul",
    id: "sensor-list",
    className: "sensor-list",
    itemView: this.SensorPreview,
    emptyView: this.NoSensorItemsView
  });
});
