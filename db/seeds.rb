# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
#

6.times do |i|
  Sensor.create(latitude: 41.38563, longitude: 2.16872, type: ["solar", "wind"].sample, active: [true, false].sample)
end
