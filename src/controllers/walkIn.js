import sheets from "../services/google/sheets";
import applicationService from "../services/application";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Applicant from "../models/applicant";

const create = async (req, res) => {
  const fields = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    school: req.body.school,
    major: req.body.major,
    isWalkIn: true,
    checkIn: true
  };

  try {
    /**
     * Validate applicant fields
     */
    await applicationService.validateWalkin(fields);

    /**
     * Insert applicant in the database
     */
    const applicant = await Applicant.create(fields);

    /**
     * Send applicant email
     */
    // mailService.applied(fields);

    /**
     * Insert applicant in google sheets
     */
    sheets.write("Applicants", fields);

    httpResponse.successResponse(res, applicant);
  } catch (e) {
    logger.info({ e, application: "Late Hacker", email: fields.email });
    httpResponse.failureResponse(res, e);
  }
};

export default { create };
