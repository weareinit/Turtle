import applicationService from "../services/application";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Candidate from "../models/candidate";
import Applicant from "../models/applicant";

const create = async (req, res) => {
  const { hacker, company } = req.body;
  try {
    await applicationService.validateCandidate(hacker);
    const applicant = await Applicant.findOne({ email: hacker.email });
    const candidateObj = {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.email,
      levelOfStudy: applicant.levelOfStudy,
      resume: applicant.resume,
      company
    };
    const candidate = await Candidate.create(candidateObj);

    httpResponse.successResponse(res, candidate);
  } catch (e) {
    logger.info({ e, application: "Candidate" });
    httpResponse.failureResponse(res, e);
  }
};
const read = async (req, res) => {
  const { page = 0, limit = 30, company = null } = req.query;

  try {
    if (!company) throw "No company requested";

    const queryLimit = parseInt(Math.abs(limit));
    const pageQuery = parseInt(Math.abs(page)) * queryLimit;

    const currentPage = pageQuery / queryLimit;

    const candidates = await Candidate.find({ company }, { _id: 0, __v: 0 })
      .skip(pageQuery)
      .limit(queryLimit)
      .sort({ timestamp: -1 });

    const count = await Candidate.countDocuments({ company });

    const overallPages = Math.floor(count / queryLimit);
    const currentQuery = candidates.length;

    candidates.length <= 0 && reject("No Applicants found.");
    currentPage > overallPages && reject("Out of range.");

    httpResponse.successResponse(res, {
      overallPages,
      currentQuery,
      count,
      currentPage,
      candidates
    });
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

export default { create, read };
