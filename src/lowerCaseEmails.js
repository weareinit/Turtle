const dotenv = require("dotenv");

dotenv.config({path: "../.env" ,silent: true});

const mongoose = require("mongoose");

const {MONGO_URI} = process.env;

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  dbName: "shellhacks",
  useFindAndModify: false
};

const db = () => Promise.resolve(mongoose.connect(MONGO_URI, options));

db()
  .then(() => console.log("> 🍃  Mongo connected"))
  .catch(e => console.log("> Mongo error ", e.message));

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
    firstTimeHack: { type: String },
    howDidYouHear: { type: String },
    areaOfFocus: { type: String, default: "N/A" },
    resume: { type: String },
    linkedIn: { type: String, default: "N/A" },
    portfolio: { type: String, default: "N/A" },
    github: { type: String, default: "N/A" },
    reasonForAttending: { type: String },
    haveBeenToShell: { type: String },
    applicationStatus: { type: String, default: "not applied" },
    needReimbursement: { type: String, default: "N/A" },
    shellID: { type: String },
    mlh: { type: Boolean, default: false },
    mlhAffiliation: { type: Boolean, default: false },
    sponsorPromo: { type: Boolean, default: false },
    timeCreated: { type: Date },
    timeApplied: { type: Date }
});

const Applicant = mongoose.model("Applicant", applicantSchema);


const lower = async () => {
  try{

    const applicants = await Applicant.find({});

    applicants.forEach(async user => { 
    // eslint-disable-next-line no-unused-vars
      const applicant = await Applicant.findOneAndUpdate({email: user.email}, 
        {
          email: user.email.toLowerCase()
        });

    });

  }catch(e){
  
    console.log(e.toString());
  }
}

lower()
.then(() => {
  console.log("> 🚀 All done.");
  process.exit(0);
})
.catch(e => console.log(e));;



