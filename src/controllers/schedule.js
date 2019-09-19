import Schedule from "../models/schedule";
import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";
import Calendar from '../services/google/calendar';

const create = async (req, res) => {
  try {
    const {
      title,
      description,
      host,
      timeCreated,
      date,
      startTime,
      endTime
    } = req.body;

    const fields = {
      title,
      description,
      host,
      timeCreated,
      date,
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
    schedule.sort((x,y) => { return new Date(x.startTime) - new Date(y.startTime) });

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
      timeCreated,
      date,
      startTime,
      endTime
    } = req.body;

    const schedule = await Schedule.findOneAndUpdate(
      { title },
      {
        title,
        description,
        host,
        timeCreated,
        date,
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

const updateEvents = async (req, res) => {
  await Calendar.asyncLoad(Schedule);

  httpResponse.successResponse(res, 'done');
}

export default {
  remove,
  update,
  read,
  create,
  updateEvents
};
