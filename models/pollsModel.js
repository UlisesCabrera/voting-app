var mongoose = require('mongoose');

var choicesSchema = new mongoose.Schema({
    choiceName : {type: String , required: true},
    voteBy : [String],
    votes : {type: Number, default: 0}
});

var pollSchema = new mongoose.Schema({
	route: String,
	title: {type: String , required: true}, 
	created_at: {type: Date, default: Date.now},
	created_by: String,
	created_by_id : String,
	choices : {type: [choicesSchema], required: true}
});

// declare a model called Polls Which has schema pollSchema with choicesSchema embedded
mongoose.model("Poll", pollSchema);