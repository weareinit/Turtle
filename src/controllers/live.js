import mailService from "../services/mail";

import logger from "../utils/logger";

import httpResponse from "../utils/httpResponses";

const create = async (req, res) => {
  const { hackers } = req.body;

  try {
    await mailService.live(hackers);
    httpResponse.successResponse(res, null);
  } catch (e) {
    logger.info({ e, application: "Live" });

    httpResponse.failureResponse(res, e);
  }
};

export default { create };
