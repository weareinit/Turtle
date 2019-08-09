import mailService from "../services/mail";
import sheets from "../services/google/sheets";
import applicationService from "../services/application";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Mentor from "../models/mentor";

const create = async (req, res) => {
  const fields = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    skills: req.body.skills
  };

  try {
    await applicationService.validateMentor(fields);

    const applicant = await Mentor.create(fields);

    /**
     * Send applicant email
     */
    mailService.mentor(fields);

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
