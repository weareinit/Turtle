import jwt from "jsonwebtoken";
import httpResponse from "../utils/httpResponses";

const { DASHBOARD_PASSWORD } = process.env;

const validateToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization.startsWith("Bearer ")) {
      const token = authorization.substring("Bearer ".length).trim();

      jwt.verify(token, DASHBOARD_PASSWORD, (err, decoded) => {
        err ? httpResponse.failureResponse(res, err.message) : next();
      });
    } else {
      return httpResponse.failureResponse(res, err.message);
    }
  } catch (e) {
    return httpResponse.failureResponse(res, "Authentication token required");
  }
};

export default { validateToken };
