var mongoose = require('mongoose');
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectID;

var UserSchema = new Schema({
    user_name : { type: String, required: true, unique: true, index: { unique: true } },
    user_pins: { type: Array, required: false, trim: true}
});


module.exports = mongoose.model('User', UserSchema);
