const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	fullName: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, default: "mother" },
	healthHistory: { type: String, default: "" },
	languagePreference: {
		type: String,
		enum: ["Sinhala", "English", "Tamil"],
		default: "English",
	},
	profileImage: {
		type: String,
		default: "https://www.w3schools.com/w3images/avatar2.png",
	},
	homeLocation: {
		type: {
			latitude: { type: Number },
			longitude: { type: Number },
			address: { type: String },
		},
		default: null,
	},
	pregnancyDate: { type: Date, default: null },
	partnerDetails: {
		type: {
			husbandName: { type: String },
			email: { type: String, match: [/.+\@.+\..+/, "Please enter a valid email"] },
			phoneNumber: { type: String, match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"] },
		},
		default: null,
	},
	age: { type: Number, min: [0, "Age cannot be negative"], default: null },
	parentingDay: { type: Date, default: null },
	createdAt: { type: Date, default: Date.now },
	weight: { type: Number, default: null }
});

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;