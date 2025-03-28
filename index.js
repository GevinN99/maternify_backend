const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const session = require("express-session")
require("dotenv").config()

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const healthPlanRoutes = require('./routes/healthPlanRoutes');
const postRoutes = require('../backend/routes/community-routes/postRoutes');
const communityRoutes = require('./routes/community-routes/communityRoutes');
const quizRoutes = require('./routes/quizRoutes');
const replyRoutes = require("./routes/community-routes/replyRoutes")
const locationRoutes = require('./routes/locationRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const conceptionRoutes = require('./routes/conceptionRoutes');

const app = express()

// Middleware
app.use(
	cors({
		origin: ["http://localhost:8081", "http://192.168.8.172:8081"],
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
)
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
	session({
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: true,
	})
)

// Connect to MongoDB
connectDB()

// Routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use("/api/users", userRoutes)
app.use("/api/health-plans", healthPlanRoutes)
app.use("/api/community-posts", postRoutes)
app.use("/api/communities", communityRoutes)
app.use("/api/community-replies", replyRoutes)
app.use('/api/location', locationRoutes);
app.use('/api/partner', partnerRoutes);
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/appointments", appointmentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/conception', conceptionRoutes);

// Export app for testing
module.exports = app;

// Start the server only if not in test mode
if (require.main === module) {
	const PORT = process.env.PORT || 8070;
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }

