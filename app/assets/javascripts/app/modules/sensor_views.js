SensorApp.module("SensorViews", function(SensorViews, App, Backbone, Marionette, $, _) {

  // Main Sensor module layout
  this.SensorLayout = Marionette.Layout.extend({
    template: "app/templates/sensors/layout",
    className: "sensor-layout",

    regions: {
      headerRegion: "#sensor-header",
      navRegion: "#sensor-nav",
      contentRegion: "#content"
    }
  });

  this.NotFoundSensorView = Marionette.ItemView.extend({
    template: "app/templates/sensors/not_found",
    tagName: "div",
    className: "no-data not-found"
  });

  this.SensorShowLayout = Marionette.Layout.extend({
    template: "app/templates/sensors/show_layout",
    className: "sensor-show-layout",

    regions: {
      mainRegion: "#sensor-show-main",
      asideRegion: "#sensor-show-aside"
    }
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
      "submit form": "saveSensor",
      "focusout #sensor-latitude": "updateModel",
      "focusout #sensor-longitude": "updateModel"
    },

    ui: {
      latitude: '#sensor-latitude',
      longitude: '#sensor-longitude',
      type: '#sensor-type',
      active: '#sensor-active', // It just caches radio buttons container
    },

    initialize: function() {
      if (!this.model) {
        // We must instantiate it because the sensor types are listed in the SensorModel defaults
        this.model = new App.Sensor.SensorModel({});
        this.listenTo(this, "invalid", this.onInvalidModel);
      }
      else {
        this.listenTo(this.model, "invalid", this.onInvalidModel);
      }
    },

    updateModel: function() {
      formValues = this._getFormValues();
      this._removeErrors();
      this.model.set(formValues, { validate: true });  
    },

    onInvalidModel: function(model) {
      this._displayErrors(model.validationError);
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

    _removeErrors: function() {
      this.$el.find('.error').remove();
      this.$el.find('.has-error').removeClass('has-error');
    },

    _getFormValues: function() {
      return {
        latitude: parseFloat(this.ui.latitude.val()),
        longitude: parseFloat(this.ui.longitude.val()),
        type: this.ui.type.val(),
        active: this._getActiveValue(this.ui.active)
      };
    },

    _onError: function(model, xhr, options) {
      var errors = JSON.parse(xhr.responseText);
      self._displayErrors(errors);
    }, 

    saveSensor: function(event) {
      var self = this;
      event.preventDefault();

      formValues = this._getFormValues();
      this._removeErrors();

      // Persist the model
      if (!this.collection) {
        this.model.save(formValues, { error: this._onError });  
      }
      // ...or just create a new model within the collection
      else {
        var model = this.collection.create(formValues, { wait: true, error: this._onError });
        if (model.validationError) this.trigger("invalid", model);
      }
    }
  });

  this.SensorPreview = Marionette.ItemView.extend({
    template: "app/templates/sensors/preview",
    tagName: "tr",
    className: "list-item sensor-list-item",

    ui: {
      deleteButton: ".delete",
      mainAction: ".main-action"
    },

    events: {
      "click .list-item-field": "showSensor",
      "click .confirm-deletion": "confirmDeletion",
      "click .delete": "deleteSensor"
    },

    initialize: function() {
      this.$el.data("model-id", this.model.id);
    },

    getModelIdFromItem: function($item) {
      return $item.data("model-id") || $item.parent().data("model-id");
    },

    showSensor: function(event) {
      var selectedItem = $(event.currentTarget);
      App.vent.trigger("sensor:show", this.getModelIdFromItem(selectedItem));
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

  this.SensorListView = Marionette.CompositeView.extend({
    template: "app/templates/sensors/list",
    tagName: "table",
    id: "sensor-list",
    className: "table sensor-list",
    itemView: this.SensorPreview,
    // emptyView: this.NoSensorItemsView,

    appendHtml: function(collectionView, itemView) {
      collectionView.$("tbody").append(itemView.el);
    }
  });
});
