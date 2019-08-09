import { google } from "googleapis";
import { Duplex } from "stream";
import path from "path";
import fs from "fs";
import { WriteStream } from "tty";
import axios from "axios";

const {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
  GOOGLE_FOLDER_ID
} = process.env;

const SCOPE = "https://www.googleapis.com/auth/drive";

const auth = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  [SCOPE]
);

const drive = google.drive("v3");

const asyncUpload = (drive, payload) =>
  new Promise((resolve, reject) => {
    drive.files.create(payload, (err, res) => {
      if (err) reject(err);

      resolve(res.data);
    });
  });

const asyncDownload = fileId =>
  new Promise((resolve, reject) => {
    const file_path = path.resolve(`tmp/${fileId}.pdf`);
    const dest = fs.createWriteStream(file_path);

    const drive = google.drive("v3");

    drive.files.get(
      {
        auth,
        fileId,
        alt: "media",
        mimeType: "application/pdf"
      },
      {
        responseType: "stream"
      },
      (err, response) => {
        if (err) throw err;

        response.data
          .on("error", err => {
            throw err;
          })
          .on("end", () => {
            resolve(file_path);
          })
          .pipe(dest);
      }
    );
  });

const bufferToStream = buffer => {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const upload = async (file, filename, folder) => {
  const { mimetype, buffer } = file;

  try {
    await auth.authorize();

    const resource = { name: filename, parents: [GOOGLE_FOLDER_ID] };

    const media = { mimeType: mimetype, body: bufferToStream(buffer) };

    const payload = {
      auth,
      resource,
      media,
      fields: "webViewLink"
    };

    const { webViewLink } = await asyncUpload(drive, payload);

    return webViewLink;
  } catch (err) {
    throw err;
  }
};

const download = async fileId => {
  try {
    await auth.authorize();

    const dest = await asyncDownload(fileId);

    return dest;
  } catch (e) {
    console.log(e);
    throw e;
  }
};

export default { upload, download };
