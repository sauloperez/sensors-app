require 'spec_helper'

describe SensorsController do

  describe "GET 'index'" do
    it "returns http success" do
      get :index
      response.should be_success
    end

    it "assigns @sensors" do
      sensors = FactoryGirl.create_list(:sensor, 2)
      get :index
      expect(assigns(:sensors)).to eq(sensors)
    end

    it "renders the index template" do
      get :index
      expect(response).to render_template("index")
    end
  end

end
