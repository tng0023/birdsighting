var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

/*Represents a bird species */
var birdSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true, uniqueCaseInsensitive: true},
  description: {type: String, required: true},
  averageEggsLaid: {type:Number, required: true, min: 1, max: 50},
  threatened: {type: Boolean, default: false},
  datesSeen:[ {type: Date, default: Date.now, validate:{
    validator: function(date){
      //return false if date is in the future
      return (date.getTime() < Date.now());
    }, message: '{VALUE} is not a valid sighting date. Date must be in the past.'
  }}],
  nest: {location: String, materials: String}
});

var Bird = mongoose.model('Bird',birdSchema);
birdSchema.plugin(uniqueValidator);

module.exports = Bird;
