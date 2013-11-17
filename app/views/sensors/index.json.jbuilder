json.array!(@sensors) do |sensor|
  json.extract! sensor, :latitude, :longitude, :type, :active
  json.url sensor_url(sensor, format: :json)
end