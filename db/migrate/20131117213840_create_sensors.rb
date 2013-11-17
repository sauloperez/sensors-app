class CreateSensors < ActiveRecord::Migration
  def change
    create_table :sensors do |t|
      t.float :latitue
      t.float :longitude
      t.string :type
      t.boolean :active

      t.timestamps
    end
  end
end
