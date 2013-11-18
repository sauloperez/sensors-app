class API::V1::SensorsController < ApplicationController
  before_action :set_sensor, only: [:show, :edit, :update, :destroy]

  # GET /api/v1/sensors
  # GET /api/v1/sensors.json
  def index
    @sensors = Sensor.all
  end

  # GET /api/v1/sensors/1
  # GET /api/v1/sensors/1.json
  def show
  end

  # GET /api/v1/sensors/new
  def new
    @sensor = Sensor.new
  end

  # GET /api/v1/sensors/1/edit
  def edit
  end

  # POST /api/v1/sensors
  # POST /api/v1/sensors.json
  def create
    @sensor = Sensor.new(sensor_params)

    respond_to do |format|
      if @sensor.save
        format.json { render action: 'show', status: :created, location: [:api, :v1, @sensor] }
      else
        format.json { render json: @sensor.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /api/v1/sensors/1
  # PATCH/PUT /api/v1/sensors/1.json
  def update
    respond_to do |format|
      if @sensor.update(sensor_params)
        format.json { head :no_content }
      else
        format.json { render json: @sensor.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /api/v1/sensors/1
  # DELETE /api/v1/sensors/1.json
  def destroy
    @sensor.destroy
    respond_to do |format|
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sensor
      @sensor = Sensor.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def sensor_params
      params.require(:sensor).permit(:latitude, :longitude, :type, :active)
    end
end
