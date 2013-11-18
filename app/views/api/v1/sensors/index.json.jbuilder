json.array!(@sensors) do |sensor|
  json.extract! sensor, :latitude, :longitude, :type, :active
  json.url api_v1_sensor_url(sensor, format: :json)
end