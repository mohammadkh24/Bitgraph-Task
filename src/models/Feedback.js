const mongoose = require("mongoose");

const schema = mongoose.Schema({
    text : {
        type : String,
        required : true
    },
    teacherId : {
        type : mongoose.Types.ObjectId,
        ref : "User",
        required : true
    },
    taskId : {
        type : mongoose.Types.ObjectId,
        ref : "Course",
        required : true
    },
})

const model = mongoose.model("Feedback" , schema);

module.exports = model