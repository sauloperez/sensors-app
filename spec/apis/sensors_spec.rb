require "spec_helper"

describe "Sensors API", api: true do
  let(:sensor) { FactoryGirl.create(:sensor) }
  
  it "retrieves a list of sensors" do
    FactoryGirl.create_list(:sensor, 2)

    get "/api/v1/sensors"

    expect(last_response.status).to eq(200)
    expect(body.length).to be > 0
  end

  it "retrieves a specific sensor" do
    get "/api/v1/sensors/#{sensor.id}"

    expect(last_response.status).to eq(200)
    expect(body).to be_kind_of(Hash)
  end

  it "creates a new sensor" do
    post "/api/v1/sensors", { sensor: sensor.attributes }

    expect(last_response.status).to eq(201)
  end

  it "updates a sensor" do
    put "/api/v1/sensors/#{sensor.id}", { sensor: sensor.attributes}

    expect(last_response.status).to eq(204)
  end
end