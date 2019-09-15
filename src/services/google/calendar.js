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
    calendarId: 'fiu.edu_ejl78tm03142fu4msi74490ld8@group.calendar.google.com',
    timeMin: (new Date()).toISOString(),
    maxResults: 20,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {

      events.map(async (event, i) => {
        // const start = event.start.dateTime || event.start.date;
        // console.log(`${start} - ${event.summary}`);
        const { id, start, end, location, summary } = event;

        const fields = {
          startTime: start.dateTime,
          endTime: end.dateTime,
          title: summary,
          id,
          location,
        }

        const found = await schema.findOne({id});
        
        if(found){
          return;
        }

        await schema.create(fields);
      });
    } else {
      console.log('No upcoming events found.');
    }

  });
 
}

export default { asyncLoad };