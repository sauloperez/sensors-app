# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
#

require 'random-location'

ref_point = [41.38563, 2.16872]

6.times do |i|
  coords = RandomLocation.near_by(ref_point[0], ref_point[1], 20000)
  Sensor.create(latitude: coords[0], longitude: coords[1], type: ["solar", "wind"].sample, active: [true, false].sample)
end
