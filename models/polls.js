var mongoose = require('mongoose');

var choicesSchema = new mongoose.Schema({
    choiceName : {type: String , required: true},
    voteBy : [String],
    votes: Number
});

var pollSchema = new mongoose.Schema({
	route: String,
	title: {type: String , required: true}, //hash created from password
	created_at: {type: Date, default: Date.now},
	created_by: String,
	choices : {type: [choicesSchema], required: true}
});

// declare a model called Polls Which has schema pollSchema with choicesSchema embedded
mongoose.model("Polls", pollSchema);