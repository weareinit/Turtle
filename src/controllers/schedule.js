import Schedule from "../models/schedule";
import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

const create = async (req, res) => {
  try {
    const {
      title,
      description,
      host,
      logo,
      category,
      startTime,
      endTime
    } = req.body;

    const fields = {
      title,
      description,
      host,
      logo,
      category,
      startTime,
      endTime
    };

    const schedule = await Schedule.create(fields);
    httpResponse.successResponse(res, schedule);
  } catch (e) {
    console.log(e);
    logger.info({ e });
    httpResponse.failureResponse(res, e);
  }
};

const read = async (req, res) => {
  try {
    const schedule = await Schedule.find({});

    return httpResponse.successResponse(res, schedule);
  } catch (e) {
    console.log(e);
    logger.info({ e });
    httpResponse.failureResponse(res, e);
  }
};

const update = async (req, res) => {
  try {
    const {
      title,
      description,
      host,
      logo,
      category,
      startTime,
      endTime
    } = req.body;

    const schedule = await Schedule.findOneAndUpdate(
      { title },
      {
        title,
        description,
        host,
        logo,
        category,
        startTime,
        endTime
      }
    ).exec();

    httpResponse.successResponse(res, schedule);
  } catch (e) {
    console.log(e);
    logger.info({ e });
    httpResponse.failureResponse(res, e);
  }
};

const remove = async (req, res) => {
  try {
    const title = req.body;

    const schedule = await Schedule.deleteOne({ title }).exec();

    httpResponse.successResponse(res, schedule);
  } catch (e) {
    console.log(e);
    logger.info({ e });
    httpResponse.failureResponse(res, e);
  }
};

export default {
  remove,
  update,
  read,
  create
};
