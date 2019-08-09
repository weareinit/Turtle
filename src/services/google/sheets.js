import { google } from "googleapis";

const {
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY,
    GOOGLE_SPREADSHEET_ID
} = process.env;

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

const auth = new google.auth.JWT(
    GOOGLE_CLIENT_EMAIL,
    null,
    GOOGLE_PRIVATE_KEY, [SCOPE]
);

const sheets = google.sheets("v4");

const asyncWrite = payload =>
    new Promise((resolve, reject) => {
        sheets.spreadsheets.values.append(payload, (err, res) => {
            if (err) reject(err);

            resolve(res);
        });
    });

const write = async(sheet, fields) => {
    try {
        await auth.authorize();

        const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
        const fieldsLength = Object.keys(fields).length;

        const values = [Object.keys(fields).map(key => fields[key])];

        const payload = {
            auth,
            spreadsheetId: GOOGLE_SPREADSHEET_ID,
            range: `${sheet}!A1:${alphabet[fieldsLength]}${fieldsLength}`,
            valueInputOption: "USER_ENTERED",
            resource: { values }
        };

        const { data } = await asyncWrite(payload);

        return data;
    } catch (err) {
        throw err;
    }
};

export default { write };