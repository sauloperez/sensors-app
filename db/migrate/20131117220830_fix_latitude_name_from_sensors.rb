class FixLatitudeNameFromSensors < ActiveRecord::Migration
  def change
    rename_column :sensors, :latitue, :latitude
  end
end
