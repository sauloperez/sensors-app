require 'spec_helper'

describe Sensor do
  subject { FactoryGirl.create(:sensor) }

  it "should have a location coordinates" do
    subject.latitude = nil
    subject.longitude = nil
    should_not be_valid
  end

  it "should have a type" do
    subject.type = nil
    should_not be_valid
  end

  it "the type should be either solar or wind" do
    subject.type = "another"
    should_not be_valid
  end

  it "should set active to true by default" do
    expect(subject.active).to eq(true)
  end
end
