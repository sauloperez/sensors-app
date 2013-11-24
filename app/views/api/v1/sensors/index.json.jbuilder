json.array!(@sensors) do |sensor|
  json.extract! sensor, :id, :latitude, :longitude, :type, :active, :created_at, :updated_at
  json.url api_v1_sensor_url(sensor, format: :json)
end
