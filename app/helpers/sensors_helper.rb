module SensorsHelper
  def google_maps_api_key
    "AIzaSyCyWizPZxwv1-T6aFeFOMfVVj2vxwebD6Y"
  end

  def google_api_url
    "https://maps.googleapis.com/maps/api/js"
  end

  def google_api_access
    "#{google_api_url}?key=#{google_maps_api_key}&sensor=false"
  end

  def google_maps_api
    content_tag(:script,:type => "text/javascript",:src => google_api_access) do
    end
  end
end
