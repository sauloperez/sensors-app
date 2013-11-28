class Sensor < ActiveRecord::Base
  TYPES = [TYPE_SOLAR = 'solar', TYPE_WIND = 'wind']

  # Disable single table inheritance
  self.inheritance_column = nil

  validates_presence_of :latitude, :longitude, :type, :active
  validates :latitude, :longitude, numericality: true
  validates :type, inclusion: {in: TYPES}
  validates :active, inclusion: { in: [true, false] }

  after_initialize :set_defaults

  def set_defaults
    self.active = true if self.active.nil?
  end
end
