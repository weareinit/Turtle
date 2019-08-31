import request from "request";
import httpResponse from "../utils/httpResponses";

const { RECAPTCHA_KEY } = process.env;

/**
 * Makes a request to google to validate user captcha response
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 */
const validate = (req, res) => {
  const { captcha } = req.body;
  const { remoteAddress } = req.connection;

  try {
    if (captcha === undefined || captcha === "" || captcha === null) {
      throw new Error(["Please select Captcha"]);
    }

    // google api url
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_KEY}&response=${captcha}&remoteip=${remoteAddress}`;

    request(verifyUrl, (err, res, body) => {
      body = JSON.parse(body);

      if (body.success !== undefined && !body.success) {
        throw new Error(["Failed CAPTCHA verification"]);
      }
      return httpResponse.successResponse(res, "CAPTCHA verified");
    });
  } catch (e) {
    httpResponse.failureResponse(res, e.toString());
  }
};

export default { validate };
