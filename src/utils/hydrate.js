const dotenv = require("dotenv");

dotenv.config({ silent: true });

const mongoose = require("mongoose");

// Data
const hackers = require("../db/hackers.json");
const candidates = require("../db/candidates.json");

/** START DB Connection */
const { MONGO_USER, MONGO_PASSWORD, MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.log("> 🙅🏻‍♂️ DB URI not provided");
  process.exit(0);
}

if (!MONGO_USER) {
  console.log("> 🙅🏻‍♂️ DB USER not provided");
  process.exit(0);
}

if (!MONGO_PASSWORD) {
  console.log("> 🙅🏻‍♂️ DB PASSWORD not provided");
  process.exit(0);
}

const options = {
  user: MONGO_USER,
  pass: MONGO_PASSWORD,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
};

async function db() {
  Promise.resolve(mongoose.connect(MONGO_URI, options));
}

db()
  .then(() => console.log("> 🗄  Mongo connected"))
  .catch(e => console.log(e.message));

/** END DB Connection */

/** START DB SCHEMAS */

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  school: { type: String, required: true },
  major: { type: String, required: true },
  levelOfStudy: { type: String, required: true },
  resume: { type: String, required: true },
  gender: { type: String, required: true },
  shirtSize: { type: String, required: true },
  diet: { type: String, default: "N/A" },
  mlh: { type: String, default: "AGREE" },
  timestamp: { type: Date, default: new Date() },
  confirmation: { type: Boolean, default: false }
});

const candidateSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  levelOfStudy: { type: String, required: true },
  email: { type: String, required: true },
  resume: { type: String, required: true },
  company: { type: String, required: true },
  timestamp: { type: Date, default: new Date() }
});

const Applicant = mongoose.model("Applicant", applicantSchema);
const Candidate = mongoose.model("Candidate", candidateSchema);

/** END DB SCHEMAS */

async function hydrate() {
  await Promise.all(
    hackers.map(async hacker => {
      await Applicant.create(hacker);
    })
  );

  await Promise.all(
    candidates.map(async candidate => {
      await Candidate.create(candidate);
    })
  );
}

hydrate()
  .then(() => {
    console.log("> 🚀 All done.");
    process.exit(0);
  })
  .catch(e => console.log(e));
