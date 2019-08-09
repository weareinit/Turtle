import mailService from "../services/mail";
import sheets from "../services/google/sheets";
import applicationService from "../services/application";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Workshop from "../models/workshop";

const create = async (req, res) => {
  const fields = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    title: req.body.title,
    description: req.body.description
  };

  try {
    await applicationService.validateWorkshop(fields);

    const applicant = await Workshop.create(fields);

    /**
     * Send applicant email
     */
    mailService.workshop(fields);

    /**
     * Insert applicant in google sheets
     */
    sheets.write("Workshops", fields);

    httpResponse.successResponse(res, applicant);
  } catch (e) {
    logger.info({ e, application: "Workshop", email: fields.email });
    httpResponse.failureResponse(res, e);
  }
};

const read = async (req, res) => {
  try {
    const workshops = await Workshop.find({});

    return httpResponse.successResponse(res, workshops);
  } catch (e) {
    logger.info({ e, application: "Workshop", email: fields.email });
    httpResponse.failureResponse(res, e);
  }
};

export default { create, read };
