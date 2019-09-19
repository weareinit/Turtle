import { Schema } from 'mongoose';

const { google } = require('googleapis');

const SCOPE = ['https://www.googleapis.com/auth/calendar'];

const {
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY,
} = process.env;

const auth = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  [SCOPE]
);

const asyncLoad = async (schema) => {
  await auth.authorize();
  await listEvents(auth, schema);
} 

const listEvents = async (auth, schema) => {
  const calendar = google.calendar({version: 'v3', auth});

  calendar.events.list({
    calendarId: 'fiu.edu_kqu3bsg50q7g95a2edbl8jeljc@group.calendar.google.com',
    timeMin: (new Date()).toISOString(),
    maxResults: 100,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {

      events.map(async (event, i) => {
        const { id, start, end, location, description: summary = "", summary: title } = event;
        try{

        const summaryLines = summary.split("\n");
        const presentersLine = summaryLines.shift();
        const presenters = presentersLine.split(',').map(presenter => {
          return presenter.trim();
        });

        let newSummary = "";

        summaryLines.forEach(line => {
          newSummary += line;
        });

        const fields = {
          startTime: start.dateTime,
          endTime: end.dateTime,
          description: newSummary,
          id,
          location,
          presenters,
          title
        }

        const found = await schema.findOne({id});
        
        if(found){
          const updated = await schema.findOneAndUpdate({ id }, fields);
          return;
        }

        await schema.create(fields);

        } catch (e) {
          console.log(e)
        }
      });
    } else {
      console.log('No upcoming events found.');
    }
  });
 
}

export default { asyncLoad };