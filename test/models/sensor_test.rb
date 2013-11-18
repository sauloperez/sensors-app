require 'test_helper'

class SensorTest < ActiveSupport::TestCase
  test "should not save sensor without location" do
    sensor = sensors(:no_location)# Sensor.new(type: "solar", active: true)
    assert !sensor.save, "Sensor saved without location"
  end

  test "should not save non-float coordinates as location" do
    sensor = Sensor.new(latitude: "a", longitude: "b") # The fixture casts them to float
    assert !sensor.save, "Sensor saved with non-float coordinates location"
  end 

  test "should not save sensor without type" do
    sensor = sensors(:no_type)
    assert !sensor.save, "Sensor saved without type"
  end

  test "its type should be either solar or wind" do
    sensor = sensors(:unknown_type)
    assert !sensor.save, "Sensor saved with an unknown type"
  end

  test "should set active true as default" do
    sensor = sensors(:no_active_set)
    assert_equal true, sensor.active
  end
end
