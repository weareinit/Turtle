import moment from "moment";
import Announcement from "../models/announcement";

import httpResponse from "../utils/httpResponses";

import logger from "../utils/logger";

const create = async (req, res) => {
  try {
    const { title, category, body, sentTime, author } = req.body;

   const fields = {
      title,
      category,
      body,
      sentTime,
      author
    };

    const announcement = await Announcement.create(fields);

    httpResponse.successResponse(res, "success");
  } catch (e) {
    logger.info(e);
    httpResponse.failureResponse(res, e);
  }
};

const read = async (req, res) => {
  try {
    const { title } = req.body;

    const announcement = await Announcement.findOne({ title });

    httpResponse.successResponse(res, announcement);
  } catch (e) {
    logger.info(e);
    httpResponse.failureResponse(res, e);
  }
};

const announce = async (req, res) => {
  try {
    const { title } = req.body;

    const sentTime = new Date();
    const announcement = await Announcement.findOneAndUpdate(
      { title },
      {
        sentTime
      },
      { new: true }
    );

    req.io.emit("announcement", announcement);

    httpResponse.successResponse(res, "success");
  } catch (e) {
    logger.info(e);
    httpResponse.failureResponse(res, e);
  }
};


const update = async (req, res) => {
  try {
    const { title, category, body, author } = req.body;


    const announcement = Announcement.findOneAndUpdate(
      { title },
      {
        category,
        body,
        author
      },
      { new: true }
    );

    httpResponse.successResponse(res, announcement);
  } catch (e) {
    logger.info(e);
    httpResponse.failureResponse(res, e);
  }
};

const remove = async (req, res) => {
  try {
    const { title } = req.body;

    const announcement = await Announcement.findOneAndDelete({ title });

    httpResponse.successResponse(res, "success");
  } catch (e) {
    logger.info(e);
    httpResponse.failureResponse(res, e);
  }
};

export default {
  create,
  read,
  announce,
  update,
  remove
};
