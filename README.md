# Turtle [![Shellhacks](https://hackathon.badge.pw/shellhacks)](https://shellhacks.net)

🐢 RESTful services  built upon [hackfiu/pear](https://github.com/hackfiu/pear)

---

## Available scripts

- `...`
- `yarn dev`: start dev server
- `yarn start`: build service and start PM2 process with arg `--name Turtle`
- `yarn restart`: rebuild service and restart named PM2 process
- `...`
  
 > See [package.json](https://github.com/UPE-FIU/Turtle/blob/jehf-CI-fixes/package.json) for more details
  
## Setting up .env

Setup your env variables before anything else </br>
See [example.env](https://github.com/UPE-FIU/Turtle/blob/master/.env.example) 

## Using the email templates

- The email templates are housed in the following [pen](https://codepen.io/dashboard/)

Heres the breakdown:

- Code as if you were using regular HTML & CSS.
- Once you're happy with the template, you need to make it compatible with emails.
- Mailchimp gives us a tool we can use to inline/reorganize or HTML & CSS to look pretty on email clients.

Visit this link for mail [inliner](https://templates.mailchimp.com/resources/inline-css/)

_Example inliner code_

```html
<style>
  <!-- Paste CSS from Codepen here -->
</style>

<!-- Paste HTML from Codepen here -->
<!-- No <html></html> tags needed -->
```

Once you pass it through the inliner, you can now use it as a template.

## Routes

### POST `/application`
-To create a new hacker object into the database

- Example request

```json
{
	"firstName":"John",
	"lastName":"Doe",
	"email":"John@gmail.com",
	"password":"secretPassword",
}
```

### POST `/application/login`
-To login a user based on email/password. Returns a JWT on success

- Example request

```json
{
	"email":"John@gmail.com",
	"password":"secretPassword",
}
```

### POST `/application/apply`
-To insert information from a hacker's application based on email (needs login token in header)

- Example request

```json
{
	"email":"John@gmail.com",
	"schoolName":"Florida International Univeristy",
	"levelOfStudy":"Freshman",
	"graduationYear":"2022",
	"major":"Computer Science",
	"gender":"Male",
	"dob":"10/29/1997",
	"race":"hispanic",
	"phoneNumber":"111-111-1111",
	"dietaryRestriction":"None",
	"firstTimeHack":"false",
	"howDidYouHear":"friends",
	"favoriteEvents":["Cup Stacking","Soylent Pong"],
	"areaOfFocus":"Web Development",
	"resume":"URL",
	"reasonForAttending":"Love Hackathons",
	"haveBeenToShell":"true",
	"likeAMentor":"false",
	"needReimburesment":"false",
	"location":"Miami",
	"shirtSize":"Medium"
}
```

### POST `/application/readOne`
-Gives back an individual hackers information based on given ShellID (needs login token in header)

- Example request

```json
{
  "shellID":"Id1"
}
```

### PUT `/application/confirm`
-Changes a hacker's status to confirmed based on email (needs login token in header)

- Example request

```json
{
  "email": "john@gmail.com"
}
```

### PUT `/admin/accept`
-Accepts hackers based on given array of shellIDs (needs admin privilages)

- Example request

```json
{
  "shellIDs":["Id1","Id2"...]
}
```

### PUT `/admin/hacker_checkIn`
-Checks in individual hacker based on shellID (needs admin privilages)

- Example request

```json
{
  "shellID": "Id1"
}
```

### PUT `/admin/event_checkIn`
-Checks in indicidual hacker to a specific event based on shellID and eventID (needs admin privilages)

- Example request

```json
{
  "shellID": "Id1",
  "eventID": "EventID1"
}
```

### POST `/mentor`

- Example request

```json
{
  "firstName": "Mike",
  "lastName": "Swift",
  "email": "foo@bar.com",
  "skills": "I can code with no shoes on."
}
```

### POST `/volunteer`

- Example request

```json
{
  "firstName": "Mike",
  "lastName": "Swift",
  "email": "foo@bar.com"
}
```

### POST `/workshop`

- Example request

```json
{
  "firstName": "Mike",
  "lastName": "Swift",
  "title": "Intro to JS.",
  "Description": "I will show people how to use JS."
}
```

### GET `/cabinet/YOUR_ROUTE_HERE`

This route is used to fetch any info

- Example request

- Route: api.mangohacks.com/cabinet/confirmed
- Authorization : "Bearer eyJhbGciOiJIUzI1Nixxxxxxxx"

returns

```json
  "data": [
        {
          "diet": "N/A",
          "mlh": "AGREE",
          "timestamp": "2019-01-26T23:20:39.137Z",
          "confirmation": false,
          "_id": "xxx",
          "firstName": "David",
          "lastName": "Castaneda",
          "email": "email@fiu.edu",
          "school": "Florida International University",
          "major": "Computer Science",
          "levelOfStudy": "JUNIOR",
          "resume": "https://drive.google.com/",
          "gender": "MALE",
          "shirtSize": "MEDIUM",
          "__v": 0
      },
  ]
```
### PUT'/application/forgot_password'

```json
  {
    "email": "email"
  }
```

### PUT'/application/reset_password'

```json
  {
    "email":"example@email.com",
    "newPassword": "5555555",
    "token": "......"
  }
```

###PUT '/application/confirmation'

```json
  {
    "email": "example@email.com",
    "emailConfrimationToken": "....."
  }
```
### POST '/announcement'

requires admin token

```json
  {
    "title": "example",
    "category": "emergency",
    "body": "SHEEEEEEEEELLLLLLLLLHACKKKKKKS",
    "author": "thatboi"
  }
```
### GET '/announcement'

### GET '/schedule'

- Example Response

```json
  {
    "_id": "5d7e9ca2ad9db474d58859bd",
    "startTime": "2019-09-18T17:00:00-04:00",
    "endTime": "2019-09-18T18:15:00-04:00",
    "title": "Nike Info Session",
    "id": "3faauo088soo4lfdritggduecj",
    "location": "PG6-112",
  }
```

### PUT '/announcement/update'

requires admin token

```json
  {
    "title": "example",
    "category": "emergency",
    "body": "SHEEEEEEEEELLLLLLLLLHACKKKKKKS",
    "author": "thatboi"
  }
```

### DELETE '/announcement/remove'

requires admin token

```json
  {
    "title": "example"
  }
```

### POST '/announcement/remove'

requires admin token

```json
  {
    "title": "example"
  }
```

## Contributors

[Tommy Carrascal](https://github.com/Tommy2016x)</br>
[Maurice Barnes](https://github.com/Barnes2197)</br>
[Alex Comas](https://github.com/aalexcomas11)</br>
[Jehf Denezaire](https://github.com/Jehfkemsy)</br>

Big shout-out to [hackfiu](https://github.com/hackfiu) for making the initial project open source
## LICENSE

[MIT](LICENSE)
