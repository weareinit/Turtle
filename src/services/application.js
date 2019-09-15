import Applicant from "../models/applicant";
import Volunteer from "../models/volunteer";
import Workshop from "../models/workshop";
import Mentor from "../models/mentor";
import varToWords from "../utils/varToWords";

/**
 * Validates walk-in hacker
 * @param {Object} applicant - Walk-in hacker fields
 */
const validateWalkin = applicant => {
  new Promise(async (resolve, reject) => {
    const isApplicant = await Applicant.findOne({ email: applicant.email });

    if (isApplicant) reject("Walk-in is already signed up.");

    const keys = Object.keys(applicant);
    keys.forEach(key => {
      const varNameWords = varToWords(key);

      if (!applicant[key]) reject(`${varNameWords} was not defined`);
    });

    resolve();
  });
};

/**
 * Validates Hacker account creation fields
 * @param {Object} fields - Hacker application fields
 */
const validateHacker = async fields =>
  new Promise(async (resolve, reject) => {
    const applicantExist = await Applicant.findOne({ email: fields.email });

    if (applicantExist) reject("Email already exists");

    resolve();
  });

/**
 * Validates workshop fields
 * @param {Object} applicant - Workshop fields
 */
const validateWorkshop = applicant =>
  new Promise(async (resolve, reject) => {
    const isApplicant = await Workshop.findOne({ email: applicant.email });

    if (isApplicant) reject("Workshop had already been created.");

    const keys = Object.keys(applicant);
    keys.forEach(key => {
      const varNameWords = varToWords(key);

      if (!applicant[key]) reject(`${varNameWords} was not defined`);
    });

    resolve();
  });

/**
 * Validates mentor application fields
 * @param {Object} applicant - Mentor application fields
 */
const validateMentor = applicant =>
  new Promise(async (resolve, reject) => {
    const isApplicant = await Mentor.findOne({ email: applicant.email });
    if (isApplicant) reject("This email address is already in use.");

    const keys = Object.keys(applicant);
    keys.forEach(key => {
      const varNameWords = varToWords(key);

      if (!applicant[key]) reject(`${varNameWords} was not defined`);
    });

    resolve();
  });

/**
 * Validates volunteer application fields
 * @param {Object} applicant - Volunteer applacation fields
 */
const validateVolunteer = applicant =>
  new Promise(async (resolve, reject) => {
    const isApplicant = await Volunteer.findOne({ email: applicant.email });

    if (isApplicant) reject("Volunteer is already signed up.");

    const keys = Object.keys(applicant);
    keys.forEach(key => {
      const varNameWords = varToWords(key);

      if (!applicant[key]) reject(`${varNameWords} was not defined`);
    });

    resolve();
  });

const validateCandidate = applicant =>
  new Promise(async (reject, resolve) => {
    if (!applicant.email) throw new Error("Email was not defined");

    resolve();
  });

const resetPasswordValidation = async (email, newPassword, token) => {
  const applicant = await Applicant.findOne({ email });

  if (!applicant) throw new Error(["Email does not exist"]);

  if (!applicant.resetPasswordToken)
    throw new Error(["User has not requested to change password"]);

  if (applicant.resetPasswordExpiration < Date.now())
    throw new Error(["Token provided is expired"]);

  if (!token) throw new Error(["Reset password token must be provided"]);

  if (
    token.toLowerCase().trim() !=
    applicant.resetPasswordToken.toLowerCase().trim()
  ) {
    console.log(
      "token " + token + " provided token: " + applicant.resetPasswordToken
    );
    throw new Error(["Token is invalid"]);
  }

  if (!newPassword) throw new Error(["new password must be provided"]);
};

const applicationStatistics = async () => {
  const numApplicants = await Applicant.countDocuments({});
  const numConfirmed = await Applicant.countDocuments({
    applicationStatus: "confirmed"
  });
  const numApplied = await Applicant.countDocuments({
    applicationStatus: "applied"
  });
  const numNotApplied = await Applicant.countDocuments({
    applicationStatus: "not applied"
  });
  const numAccepted = await Applicant.countDocuments({
    applicationStatus: "accepted"
  });
  const numMales = await Applicant.countDocuments({ gender: "male" });
  const numFemales = await Applicant.countDocuments({ gender: "Female" });
  const numCantGo = await Applicant.countDocuments({ applicationStatus: "can't go" });

  const applicants = await Applicant.find({});
  const schoolMap = {};

  applicants.forEach(applicant => {
    const { schoolName } = applicant;

    if (
      schoolName === "null" ||
      schoolName === null ||
      schoolName === "other" ||
      schoolName === "Other"
    )
      return;

    schoolMap[schoolName] = schoolMap[schoolName] + 1 || 1;
  });

  const sortedSchools = [];

  for (let school in schoolMap) {
    sortedSchools.push([school, schoolMap[school]]);
  }

  sortedSchools.sort((a, b) => {
    return b[1] - a[1];
  });

  return {
    numApplicants,
    numConfirmed,
    numApplied,
    numNotApplied,
    numFemales,
    numMales,
    numAccepted,
    sortedSchools,
    numCantGo
  };
};

export default {
  validateHacker,
  validateWalkin,
  validateWorkshop,
  validateMentor,
  validateVolunteer,
  validateCandidate,
  resetPasswordValidation,
  applicationStatistics
};
