import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    emailConfirmed: { type: Boolean, default: false },
    emailConfirmationToken: { type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpiration: { type: Date },
    schoolName: { type: String },
    avatarID: { type: Number },
    checkIn: { type: Boolean, default: false },
    levelOfStudy: { type: String, default: "N/A" },
    graduationYear: { type: String, default: "N/A" },
    major: { type: String, default: "N/A" },
    gender: { type: String, default: "N/A" },
    dob: { type: String },
    race: { type: String, default: "N/A" },
    phoneNumber: { type: String },
    shirtSize: { type: String },
    dietaryRestriction: { type: String },
    firstTimeHack: { type: Boolean },
    howDidYouHear: { type: String },
    areaOfFocus: { type: String, default: "N/A" },
    resume: { type: String },
    linkedIn: { type: String, default: "N/A" },
    portfolio: { type: String, default: "N/A" },
    github: { type: String, default: "N/A" },
    reasonForAttending: { type: String },
    haveBeenToShell: { type: String, default: "N/A" },
    applicationStatus: { type: String, default: "not applied" },
    needReimbursement: { type: String, default: "N/A" },
    shellID: { type: String },
    mlh: { type: Boolean, default: false },
    sponsorPromo: { type: Boolean, default: false },
    timeCreated: { type: Date },
    timeApplied: { type: Date }
});

const Applicant = mongoose.model("Applicant", applicantSchema);

export default Applicant;