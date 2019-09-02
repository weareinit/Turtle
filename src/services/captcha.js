import axios from "axios";
import qs from "querystring";
/**
 * Makes a request to google to validate user captcha response
 * @param {String} captcha - user captcha response
 * @param {String} remoteAddress - user ip address
 * @param {String} RECAPTCHA_KEY - private reCAPTCHA key
 */
const validate = async (captcha, remoteAddress, RECAPTCHA_KEY) => {
  if (captcha === undefined || captcha === "" || captcha === null) {
    throw new Error(["Please complete captcha"]);
  }

  const url = "https://www.google.com/recaptcha/api/siteverify";
  const requestBody = {
    secret: "hello",
    response: captcha,
    remoteip: remoteAddress
  };

  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  };
  let isFailed;
  await axios
    .post(url, qs.stringify(requestBody), config)
    .then(response => {
      const { data } = response;
      console.log(data);
      if (data.success === undefined || !data.success) {
        throw "Failed CAPTCHA verification";
      }
      return "CAPTCHA verified";
    })
    .catch(e => (isFailed = e)); // this is some hacky stuff... don't have the time to fix rn
  if (isFailed) throw isFailed;
};

export default { validate };
