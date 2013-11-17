require 'test_helper'

class SensorTest < ActiveSupport::TestCase
  test "should not save sensor without location" do
    sensor = Sensor.new(type: "solar", active: true)
    assert !sensor.save
  end

  test "should not save sensor without type" do
    sensor = Sensor.new(type: "some", latitude: 1.2, longitude: 1.2)
    assert !sensor.save, "Sensor saved without type"
  end

  test "its type should be either solar or wind" do
    sensor = Sensor.new(type: "another", latitude: 1.2, longitude: 1.2)
    assert !sensor.save, "Sensor saved with an unknown type"
  end

  test "should set active true as default" do
    sensor = Sensor.new(type: "wind", latitude:1.2, longitude: 1.2)
    assert_equal true, sensor.active
  end
end
