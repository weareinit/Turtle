import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import { runInNewContext } from "vm";
import { http } from "winston";
import crypto from "crypto";
import mailService from "../services/mail";
import fileService from "../services/file";
import drive from "../services/google/drive";
import sheets from "../services/google/sheets";
import createID from "../utils/idGenerator";
import applicationService from "../services/application";
import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";
import Applicant from "../models/applicant";
import createFileName from "../utils/createFileName";
import captchaService from "../services/captcha";

const { GOOGLE_FOLDER_ID, GOOGLE_SPREADSHEET_ID, SECRET_KEY,RECAPTCHA_KEY } = process.env;

/**
 * Creates a user account
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const create = async (req, res) => {
  const {remoteAddress} = req.connection;
  const { firstName, lastName, email, captcha } = req.body;

  try {

    await captchaService.validate(captcha, remoteAddress, RECAPTCHA_KEY);

    await applicationService.validateHacker(req.body);

    const date = new Date();

    //  hash password
    const hash = bcrypt.hashSync(req.body.password);

    let unique = null;

    let id;

    do {
      id = createID.createId(5);

      unique = await Applicant.findOne({ shellID: id });
    } while (unique !== null);

    const shellID = id;
    const emailConfirmationToken = await createID.makeid(6).toUpperCase();
    const avatarID = await createID.createAvatar();

    const lowercaseemail = email.toLowerCase();

    const fields = {
      firstName,
      lastName,
      email: lowercaseemail,
      password: hash,
      shellID,
      emailConfirmationToken,
      applicationStatus: "not applied",
      resetPasswordToken: null,
      resetPasswordExpiration: null,
      schoolName: null,
      levelOfStudy: null,
      graduationYear: null,
      major: null,
      gender: null,
      dob: null,
      race: null,
      phoneNumber: null,
      shirtSize: null,
      dietaryRestriction: null,
      firstTimeHack: null,
      howDidYouHear: null,
      favoriteEvents: null,
      areaOfFocus: null,
      resume: null,
      linkedIn: null,
      portfolio: null,
      github: null,
      reasonForAttending: null,
      haveBeenToShell: null,
      needReimburesment: null,
      timeCreated: date,
      timeApplied: null,
      avatarID
    };

    // Insert applicant in the database
    const applicant = await Applicant.create(fields);

    // Send applicant email
    mailService.emailVerification(applicant);

    // Insert applicant in google sheets
    sheets.write("Applicants", fields);

    return httpResponse.successResponse(res, "success");
  } catch (e) {
    logger.info({ e, application: "Hacker", email });
    return httpResponse.failureResponse(res, e.toString());
  }
};

/**
 * Creates a user account via walk in
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const walkIn = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    await applicationService.validateHacker(req.body);

    const date = new Date();

    let unique = null;

    let id;

    do {
      id = createID.createId(5);

      unique = await Applicant.findOne({ shellID: id });
    } while (unique !== null);

    const shellID = id;
    const avatarID = await createID.createAvatar();

    const lowercaseemail = email.toLowerCase();
    const hash = bcrypt.hashSync(password);

    const fields = {
      firstName,
      lastName,
      email: lowercaseemail,
      password: hash,
      shellID,
      emailConfirmationToken: 'walkInToken',
      applicationStatus: "confirmed",
      resetPasswordToken: null,
      resetPasswordExpiration: null,
      schoolName: null,
      levelOfStudy: null,
      graduationYear: null,
      major: null,
      gender: null,
      dob: null,
      race: null,
      phoneNumber: null,
      shirtSize: null,
      dietaryRestriction: null,
      firstTimeHack: null,
      howDidYouHear: null,
      favoriteEvents: null,
      areaOfFocus: null,
      resume: null,
      linkedIn: null,
      portfolio: null,
      github: null,
      reasonForAttending: null,
      haveBeenToShell: null,
      needReimburesment: null,
      timeCreated: date,
      timeApplied: null,
      avatarID,
      walkIn: true,
      checkIn: true,
      emailConfirmed: true
    };

    // Insert applicant in the database
    const applicant = await Applicant.create(fields);

    // Insert applicant in google sheets
    sheets.write("Applicants", fields);

    return httpResponse.successResponse(res, "success");
  } catch (e) {
    logger.info({ e, application: "Hacker", email });
    return httpResponse.failureResponse(res, e.toString());
  }
};

/**
 *
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const read = async (req, res) => {
  const { page = 0, limit = 30, q, filter } = req.query;

  const queryLimit = parseInt(Math.abs(limit));
  const pageQuery = parseInt(Math.abs(page)) * queryLimit;

  const currentPage = pageQuery / queryLimit;

  let searchCriteria = {};
  try {
    if (q && q.length > 0 && q !== "") {
      searchCriteria = {
        $or: [
          { firstName: new RegExp(".*" + q + ".*", "i") },
          { lastName: new RegExp(".*" + q + ".*", "i") },
          { email: new RegExp(".*" + q + ".*", "i") },
          { schoolName: new RegExp(".*" + q + ".*", "i") }
        ]
      };
    }

    if (filter == "noReimbursement"){
      searchCriteria["$and"] = [{ applicationStatus: 'applied'}, { needReimbursement: 'NO' }]
    } else {
      filter ? (searchCriteria["$and"] = [{ applicationStatus: filter }]) : null;
    }

    const allApplicants = await Applicant.find(searchCriteria);

    const applicants = await Applicant.find(searchCriteria, {
      _id: 0,
      __v: 0
    })
      .skip(pageQuery)
      .limit(queryLimit)
      .sort({ timestamp: -1 });

    if (!applicants || applicants.length <= 0) {
      throw new Error("No Applicants found.");
    }

    const count = await Applicant.countDocuments(searchCriteria);
    const checkedInCount = await Applicant.countDocuments({ checkIn: true });
    const overallPages = Math.ceil(count / queryLimit);
    const currentQuery = applicants.length;

    if (currentPage > overallPages) {
      throw new Error("Out of range.");
    }

    return httpResponse.successResponse(res, {
      overallPages,
      currentQuery,
      count,
      currentPage,
      applicants,
      allApplicants,
      checkedInCount
    });
  } catch (e) {
    return httpResponse.failureResponse(res, e.toString());
  }
};

/**
 *
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const readOne = async (req, res) => {
  const { shellID } = req.body;

  try {
    const user = await Applicant.findOne({ shellID });

    if(!user)
      throw Error("User does not exist");

    httpResponse.successResponse(res, user);
  } catch (e) {
    httpResponse.failureResponse(res, e.toString());
  }
};

const deleteOne = async (req, res) => {
  const { shellID } = req.body;

  try {
    const user = await Applicant.findOneAndDelete({ shellID });
    httpResponse.successResponse(res, "User deleted");
  } catch (e) {
    httpResponse.failureResponse(res, e.toString());
  }
};

/**
 *
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const update = async (req, res) => {
  const { email } = req.query;

  try {
    const hasConfirmed = await Applicant.findOne({ email }).exec();

    if (!hasConfirmed.confirmation) {
      const confirm = await Applicant.findOneAndUpdate(
        { email },
        { confirmation: true },
        { new: true }
      ).exec();

      const confirmFields = {
        firstName: confirm.firstName,
        lastName: confirm.lastName,
        email: confirm.email,
        school: confirm.school,
        major: confirm.major,
        levelOfStudy: confirm.levelOfStudy,
        gender: confirm.gender,
        shirtSize: confirm.shirtSize,
        diet: confirm.diet,
        resume: confirm.resume
      };

      if (GOOGLE_SPREADSHEET_ID) {
        sheets.write("confirmed", confirmFields);
      }

      httpResponse.successResponse(res, confirm);
    } else {
      httpResponse.successResponse(res, null);
    }
  } catch (e) {
    httpResponse.failureResponse(res, e.toString());
  }
};

/**
 *
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const accept = async (req, res) => {
  const { shellIDs } = req.body;

  try {
    shellIDs.forEach(async shellID => {
      let accepted = await Applicant.findOne({ shellID });

      if (accepted.applicationStatus !== "applied") {
        return;
      }

      accepted = await Applicant.findOneAndUpdate(
        { shellID },
        { applicationStatus: "accepted" }
      ).exec();
    });

    return httpResponse.successResponse(res, 'success');
  } catch (e) {
    return httpResponse.failureResponse(res, e.toString());
  }
};

/**
 * Changes a single hacker's status from accepted to confirmed
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const confirm = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Applicant.findOneAndUpdate(
      { email },
      { applicationStatus: "confirmed" }
    ).exec();

    return httpResponse.successResponse(res, 'success');
  } catch (e) {
    return httpResponse.failureResponse(res, e.toString());
  }
};

/**
 * Changes a single hacker's status from accepted to cannot go
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const cantGo = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Applicant.findOneAndUpdate(
      { email },
      { applicationStatus: "can't go" }
    ).exec();

    return httpResponse.successResponse(res, 'success');
  } catch (e) {
    return httpResponse.failureResponse(res, e.toString());
  }
};

/**
 * Process user application
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const apply = async (req, res) => {
  fileService.extractResume(req, res, async err => {
    if (err) return httpResponse.failureResponse(res, err);
    const { file } = req;

    const {
      // personal
      email,
      dob,
      gender,
      race,
      phoneNumber,
      // school
      schoolName,
      levelOfStudy,
      graduationYear,
      major,
      // professional
      areaOfFocus,
      resume,
      linkedIn,
      portfolio,
      github,
      // additional
      shirtSize,
      dietaryRestriction,
      firstTimeHack,
      howDidYouHear,
      reasonForAttending,
      haveBeenToShell,
      needReimbursement,
      mlh,
      sponsorPromo,
      mlhAffiliation
    } = req.body;

    const currTime = new Date();

    const fields = {
      // personal
      email,
      dob,
      gender,
      race,
      phoneNumber,
      // school
      schoolName,
      levelOfStudy,
      graduationYear,
      major,
      // professional
      areaOfFocus,
      resume,
      linkedIn,
      portfolio,
      github,
      // additional
      shirtSize,
      dietaryRestriction,
      firstTimeHack,
      howDidYouHear,
      reasonForAttending,
      haveBeenToShell,
      needReimbursement,
      mlh,
      sponsorPromo,
      timeApplied: currTime,
      applicationStatus: "applied",
      mlhAffiliation
    };

    try {
      if (!file) throw new Error(["Resume is required."]);

      // await applicationService.validateHacker(fields);//need to unable

      // Generate resume name
      const { firstName, lastName } = await Applicant.findOne({ email });
      const filename = createFileName(firstName, lastName, phoneNumber);
      fields.resume = "N/A";

      // Upload resume
      if (GOOGLE_FOLDER_ID) {
        const resumeUrl = await drive.upload(file, filename, GOOGLE_FOLDER_ID);
        fields.resume = resumeUrl;
      }

      // update applicant in the database
      const user = await Applicant.findOneAndUpdate({ email }, fields, {
        new: true
      }).exec();

      // Send applicant email
      mailService.applicantionConfirmation(user);

      // Insert applicant in google sheets
      sheets.write("Applicants", fields);

      return httpResponse.successResponse(res, null);
    } catch (e) {
      logger.info({ e, application: "Hacker", email: fields.email });
      return httpResponse.failureResponse(res, e.toString());
    }
  });
};

/**
 * Process user login atempt
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const lowercaseemail = email.toLowerCase();

    const user = await Applicant.findOne({ email: lowercaseemail });

    if (!user) throw new Error(["Wrong login info"]);

    if (!user.emailConfirmed)
      return httpResponse.failureResponse(res, "Email not verfied");

    const correctPass = bcrypt.compareSync(password, user.password);
    if (!correctPass) throw new Error(["Wrong login info"]);

    const expDate = 60 * 60 * 144;

    const { shellID } = user;

    const JWT = await jwt.sign({ key: shellID }, SECRET_KEY, {
      expiresIn: expDate
    });

    return httpResponse.successResponse(res, { JWT, shellID });
  } catch (e) {
    return httpResponse.failureResponse(res, e.toString());
  }
};

/**
 *
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const unconfirm = async (req, res) => {
  try {
    const { email } = req.body;

    const unconfirmation = await Applicant.findOneAndUpdate(
      { email },
      { applicationStatus: "accepted" }
    ).exec();
    httpResponse.successResponse(res, unconfirmation);
  } catch (e) {
    logger.info({ e, application: "Hacker" });
    httpResponse.failureResponse(res, e.toString());
  }
};

/**
 * Mark user as checked in
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const hackerCheckIn = async (req, res) => {
  const { shellID } = req.body;

  try {
    const checkedIn = await Applicant.findOneAndUpdate(
      { shellID },
      { checkIn: true },
      { new: true }
    ).exec();

    httpResponse.successResponse(res, checkedIn);
  } catch (e) {
    httpResponse.failureResponse(res, e.toString());
  }
};

/**
 * Checks in user to event
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const eventCheckIn = async (req, res) => {
  const { shellID, eventID} = req.body;

  try {
    const user = await Applicant.findOne({ shellID });

    if(!user){
      throw new Error(["User does not exist"]);
    }

    const { eventsAttended = [] } = user;

    if(eventsAttended.includes(eventID)){
      throw new Error(["User already checked in to event"]);
    }

    eventsAttended.push(eventID);

    const updated = await Applicant.findOneAndUpdate(
        { shellID },
        { eventsAttended, eventsCount: eventsAttended.length}
      ).exec();

    httpResponse.successResponse(res, 'User Checked in');
  } catch (e) {
    httpResponse.failureResponse(res, e.toString());
  }
};

/**
 * Sends user token to reset password
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const token = await crypto.randomBytes(6).toString("hex");

    const date = new Date();
    const tomorrow = await date.setTime(date.getTime() + 24 * 60 * 60 * 1000);

    const applicant = await Applicant.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpiration: tomorrow
      },
      { new: true }
    );

    if (applicant === null) {
      throw new Error(["User email does not exist"]);
    }

    mailService.forgotPassword(applicant);

    httpResponse.successResponse(res, "Reset password email sent");
  } catch (err) {
    logger.info();
    httpResponse.failureResponse(res, err.toString());
  }
};

/**
 * Updates user password
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, token } = req.body;

    await applicationService.resetPasswordValidation(email, newPassword, token);

    const password = bcrypt.hashSync(newPassword);

    const updatedApplicant = await Applicant.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: null,
        resetPasswordExpiration: null,
        password
      }
    );

    if (updatedApplicant === null) throw new Error(["Error, try again later"]);

    mailService.resetPassword(updatedApplicant);

    httpResponse.successResponse(res, "Email succesfully reset");
  } catch (err) {
    httpResponse.failureResponse(res, err.toString());
  }
};

/**
 * Sends reminder to fill out application
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const remindApply = async (req, res) => {
  try {
    const remind = await Applicant.find({ applicationStatus: "not applied" });

    remind.forEach(applicant => {
      mailService.applicationReminder(applicant);
    });

    httpResponse.successResponse(res, null);
  } catch (e) {
    logger.info({ e });
    httpResponse.failureResponse(res, e.toString());
  }
};

/**
 * Sends reminder to confirm attendance
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const remindConfirm = async (req, res) => {
  try {
    const remind = await Applicant.find({ applicationStatus: "accepted" });

    remind.forEach(applicant => {
      mailService.acceptReminder(applicant);
    });

    httpResponse.successResponse(res, null);
  } catch (e) {
    logger.info({ e });
    httpResponse.failureResponse(res, e.toString());
  }
};

/**
 * Mark user email verified
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const emailConfirmation = async (req, res) => {
  try {
    const { emailConfirmationToken, email } = req.body;

    const token = emailConfirmationToken.toUpperCase().trim();
    const lowercaseemail = email.toLowerCase();

    const applicant = await Applicant.findOneAndUpdate(
      { email: lowercaseemail, emailConfirmationToken: token },
      {
        emailConfirmed: true,
        emailConfirmationToken: null
      }
    );

    if (applicant === null) {
      return httpResponse.failureResponse(res, "User not found");
    }

    mailService.accountConfirmation(applicant);
    httpResponse.successResponse(res, "success");
  } catch (e) {
    logger.info({ e });
    httpResponse.failureResponse(res, e.toString());
  }
};

/**
 * Resends email confirmation token
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const resend = async (req, res) => {
  try {
    const { email } = req.body;

    const found = await Applicant.findOne({ email });

    if (!found) throw new Error(["Email does not exist"]);

    if (found.emailConfirmed) throw new Error(["Email is already verified"]);

    const emailConfirmationToken = await createID.makeid(6).toUpperCase();

    const applicant = await Applicant.findOneAndUpdate(
      { email },
      {
        emailConfirmationToken
      },
      { new: true }
    );

    mailService.emailVerification(applicant);

    httpResponse.successResponse(res, "success");
  } catch (e) {
    logger.info(e);
    httpResponse.failureResponse(res, e);
  }
};

export default {
  create,
  read,
  readOne,
  update,
  deleteOne,
  confirm,
  apply,
  unconfirm,
  login,
  forgotPassword,
  resetPassword,
  hackerCheckIn,
  eventCheckIn,
  accept,
  remindApply,
  emailConfirmation,
  remindConfirm,
  resend,
  cantGo,
  walkIn
};
