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

const asyncLoad = async () => {
  await auth.authorize();

  const events = listEvents(auth);

  return events;
} 

listEvents = (auth) => {
  const calendar = google.calendar({version: 'v3', auth});

  calendar.events.list({
    calendarId: 'upe@fiu.edu',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      console.log('Upcoming 10 events:');
      events.map((event, i) => {
        const start = event.start.dateTime || event.start.date;
        console.log(`${start} - ${event.summary}`);
      });
    } else {
      console.log('No upcoming events found.');
    }

    return events;
  });
}

export default { asyncLoad };