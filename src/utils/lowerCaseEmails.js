import Applicant from "../models/applicant";
import httpResponse from "./httpResponses";
import logger from "./logger";

const lower = async (req, res) => {
  try{
  const applicants = await Applicant.find({});

  applicants.map(async user => { 
    const applicant = await Applicant.findOneAndUpdate({email: user.email}, 
      {
        email: user.email.toLowerCase()
      });

  });

  return httpResponse.successResponse(res, "success");

  }catch(e){
    logger.info({e: e.toString()});
    return httpResponse.failureResponse(res, e.toString());
  }
}

export default {lower};