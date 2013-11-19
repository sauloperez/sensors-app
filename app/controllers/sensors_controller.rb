class SensorsController < ApplicationController

  # App entry point
  def index
    @sensors = Sensor.all
  end
end
