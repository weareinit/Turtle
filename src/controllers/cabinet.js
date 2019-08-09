import Applicant from "../models/applicant";

import httpResponse from "../utils/httpResponses";

import googleService from "../services/google/drive";

import applicationService from "../services/application";

const confirmed = async (req, res) => {
  try {
    const confirmed = await Applicant.find({ confirmation: true }).exec();

    httpResponse.successResponse(res, confirmed);
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

const unconfirmed = async (req, res) => {
  try {
    const unconfirmed = await Applicant.find({ confirmation: false }).exec();

    httpResponse.successResponse(res, unconfirmed);
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

const checkedIn = async (req, res) => {
  try {
    const checkin = await Applicant.find({ checkIn: true }).exec();

    httpResponse.successResponse(res, checkin);
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

const females = async (req, res) => {
  try {
    const females = await Applicant.find({ gender: "FEMALE" }).exec();

    httpResponse.successResponse(res, females);
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

const males = async (req, res) => {
  try {
    const males = await Applicant.find({ gender: "MALE" }).exec();

    httpResponse.successResponse(res, males);
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

const download = async (req, res) => {
  try {
    const { id } = req.query;

    const file_path = await googleService.download(id);

    res.download(file_path);
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

const statistics = async (req, res) => {
  try {
    const statistics = await applicationService.applicationStatistics();

    httpResponse.successResponse(res, statistics);
  } catch (e) {
    httpResponse.failureResponse(res, err);
  }
};

export default {
  confirmed,
  unconfirmed,
  females,
  males,
  download,
  checkedIn,
  statistics
};
