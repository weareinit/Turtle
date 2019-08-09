import mailService from "../services/mail";
import sheets from "../services/google/sheets";
import applicationService from "../services/application";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Volunteer from "../models/volunteer";

const create = async (req, res) => {
  const fields = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email
  };

  try {
    await applicationService.validateVolunteer(fields);

    const applicant = await Volunteer.create(fields);

    /**
     * Send applicant email
     */
    mailService.volunteer(fields);

    /**
     * Insert applicant in google sheets
     */
    sheets.write("Volunteers", fields);

    httpResponse.successResponse(res, applicant);
  } catch (e) {
    console.log(e);
    logger.info({ e, application: "Volunteer", email: fields.email });
    httpResponse.failureResponse(res, e);
  }
};

export default { create };
