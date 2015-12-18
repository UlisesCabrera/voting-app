var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: {type: String , required: true},
	email: {type: String , unique: true},
	password: {type: String , required: true}, //hash created from password
	created_at: {type: Date, default: Date.now},
	polls_created : Array,
	polls_created_count: {type: Number, default: 0}
});

// declare a model called User Which has schema userSchema.
mongoose.model("User", userSchema);