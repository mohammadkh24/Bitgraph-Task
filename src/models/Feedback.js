const mongoose = require("mongoose");

const schema = mongoose.Schema({
    text : {
        type : String,
        required : true
    },
    teacherId : {
        type : mongoose.Types.ObjectId,
        ref : "User"
    },
    courseId : {
        type : mongoose.Types.ObjectId,
        ref : "Course"
    },
})

const model = mongoose.model("Feedback" , schema);

module.exports = model