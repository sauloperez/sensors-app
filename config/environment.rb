# Set the proper environment used
ENV['RAILS_ENV'] = 'development'

# Load the rails application.
require File.expand_path('../application', __FILE__)

# Initialize the rails application.
SensorsApp::Application.initialize!
