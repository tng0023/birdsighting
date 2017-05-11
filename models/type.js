var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

/*represents a type of maintenance*/
var typeSchema = new mongoose.Schema({
  type: {type:String,required:true, unique:true,uniqueCaseInsensitive: true},
  company: String,
  contact: String,
  phone: Number,
  notes: String,
  dateSet: {type: Date, default: Date.now, validate: { validator : function(date){
    return(date.getTime() > Date.now());
  }, message: '{VALUE} is not a valid date. Date must be in the future.'
}},
});

var Type = mongoose.model('Type', typeSchema);

module.exports = Type;
