import sheets from "../services/google/sheets";
import httpResponse from "../utils/httpResponses";
import Applicant from "../models/applicant";

const { GOOGLE_SPREADSHEET_ID } = process.env;

const create = async (req, res) => {
  const { email } = req.body;

  try {
    const applicant = await Applicant.findOne({ email }).exec();

    if (!applicant.checkIn) {
      const checkIn = await Applicant.findOneAndUpdate(
        { email },
        { checkIn: true },
        { new: true }
      ).exec();

      const checkInFields = {
        firstName: checkIn.firstName,
        lastName: checkIn.lastName,
        email: checkIn.email,
        school: checkIn.school,
        major: checkIn.major,
        levelOfStudy: checkIn.levelOfStudy,
        gender: checkIn.gender,
        shirtSize: checkIn.shirtSize,
        diet: checkIn.diet,
        resume: checkIn.resume,
        isWalkin: checkIn.isWalkin || false,
        confirmed: checkIn.confirmation
      };

      if (GOOGLE_SPREADSHEET_ID) {
        await sheets.write("CheckedIn", checkInFields);
      }

      httpResponse.successResponse(res, checkIn);
    } else {
      httpResponse.successResponse(res, applicant);
    }
  } catch (e) {
    console.log(e);
    httpResponse.failureResponse(res, e);
  }
};

export default { create };
