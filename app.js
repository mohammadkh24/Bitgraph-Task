const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const docsRoutes = require("./docs/swagger.routes")
const authRoutes = require("./src/modules/auth/auth.routes")
const usersRoutes = require("./src/modules/users/users.routes")
const coursesRoutes = require("./src/modules/courses/courses.routes")
const tasksRoutes = require("./src/modules/tasks/tasks.routes")
const feedbackRoutes = require("./src/modules/feedback/feedback.routes")

const app = express();

// Get public
app.use(express.static(path.join(__dirname, "public")));

// Get req.body
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use("/doc" , docsRoutes);
app.use("/auth" , authRoutes);
app.use("/users" , usersRoutes);
app.use("/courses" , coursesRoutes);
app.use("/tasks" , tasksRoutes);
app.use("/feedback" , feedbackRoutes);

// Not-fond page
app.use((req,res) => {
    return res.status(404).json({
        message : "Path Not-Found!"
    })
})

module.exports = app