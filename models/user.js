var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: {type: String , required: true},
	password: {type: String , required: true}, //hash created from password
	created_at: {type: Date, default: Date.now},
	polls_created : Array,
	polls_created_count: {type: Number, default: 0},
	secret_Q_A: {
		question: String,
		answer: String
	}
});

// declare a model called User Which has schema userSchema.
mongoose.model("User", userSchema);