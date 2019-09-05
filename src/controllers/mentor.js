import mailService from "../services/mail";
import sheets from "../services/google/sheets";
import applicationService from "../services/application";
import captchaService from "../services/captcha";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Mentor from "../models/mentor";

const {
  GOOGLE_FOLDER_ID,
  GOOGLE_SPREADSHEET_ID,
  SECRET_KEY,
  RECAPTCHA_KEY
} = process.env;

const create = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    organization,
    mentored,
    skills,
    elaborate,
    shirtSize,
    availibity,
    mlhCOC,
    captcha
  } = req.body;

  const fields = {
    firstName,
    lastName,
    email,
    phoneNumber,
    organization,
    mentored,
    skills,
    elaborate,
    shirtSize,
    availibity,
    mlhCOC
  };

  try {
    await captchaService.validate(captcha, remoteAddress, RECAPTCHA_KEY);
    await applicationService.validateMentor(fields);

    const applicant = await Mentor.create(fields);

    /**
     * Send applicant email
     */
    // mailService.mentor(fields);

    /**
     * Insert applicant in google sheets
     */
    sheets.write("Mentors", fields);

    httpResponse.successResponse(res, applicant);
  } catch (e) {
    logger.info({ e, application: "Mentor", email: fields.email });
    httpResponse.failureResponse(res, e);
  }
};

export default { create };
