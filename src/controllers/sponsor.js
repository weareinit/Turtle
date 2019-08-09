import Sponsor from "../models/sponsor";
import httpResponses from "../utils/httpResponses";
import logger from "../utils/logger";

const create = async (req, res) => {
  try {
    const { name, category, logo, description, jobsite } = req.body;

    const fields = {
      name,
      category,
      logo,
      description,
      jobsite
    };

    const sponsor = await Sponsor.create(fields);

    httpResponses.successResponse(res, "success");
  } catch (e) {
    httpResponses.failureResponse(res, e);
    console.log(e);
  }
};

const read = async (req, res) => {
  try {
    const { name } = req.body;

    const sponsor = await Sponsor.findOne({ name });

    httpResponses.successResponse(res, sponsor);
  } catch (e) {
    httpResponses.failureResponse(res, e);
  }
};

const update = async (req, res) => {
  try {
    const { name, description, logo, category, jobsite } = req.body;

    const sponsor = await Sponsor.findOneAndUpdate(
      { name },
      {
        description,
        logo,
        category,
        jobsite
      },
      { new: true }
    );

    httpResponses.successResponse(res, sponsor);
  } catch (e) {
    logger.info(e);
    httpResponses.failureResponse(res, e);
  }
};

const remove = async (req, res) => {
  try {
    const { name } = req.body;
    const sponsor = await Sponsor.findOneAndDelete({ name });

    httpResponses.successResponse(res, sponsor);
  } catch (e) {
    httpResponses.failureResponse(res, e);
  }
};

export default {
  create,
  update,
  remove,
  read
};
