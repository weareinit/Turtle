import { Router } from "express";

import announcement from "../controllers/announcement";
import application from "../controllers/application";
// import volunteer from "../controllers/volunteer";
// import candidate from "../controllers/candidate";
import workshop from "../controllers/workshop";
import cabinet from "../controllers/cabinet";
import mentor from "../controllers/mentor";
import token from "../controllers/token";
// import live from "../controllers/live";
// import walkIn from "../controllers/walkin";
// import checkin from "../controllers/checkin";
import expoToken from '../controllers/expoToken';
import schedule from "../controllers/schedule";
import sponsor from "../controllers/sponsor";
import adminAuthMiddleware from "../middleware/adminAuth";
import hackerAuthMiddleware from "../middleware/hackerAuth";
import lowerCaseEmails from "../utils/lowerCaseEmails";

const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("Welcome to the beach!"));

/* ------ Application Routes ------ */
apiRouter.get("/application", adminAuthMiddleware, application.read);
apiRouter.post("/application", application.create);
apiRouter.post("/application/readOne", hackerAuthMiddleware, application.readOne);
apiRouter.post("/application/login", application.login);
apiRouter.put("/application/confirm",hackerAuthMiddleware,application.confirm);
apiRouter.put("/application/update", hackerAuthMiddleware, application.update);
apiRouter.put("/application/apply", hackerAuthMiddleware, application.apply);
apiRouter.put("/application/cant_go",hackerAuthMiddleware,application.cantGo);
apiRouter.put("/application/forgot_password", application.forgotPassword);
apiRouter.put("/application/reset_password", application.resetPassword);
apiRouter.put("/application/confirmation", application.emailConfirmation);
apiRouter.put("/application/resend", application.resend);
// apiRouter.post("/application/:email/:token",application.confirmEmail);

/* ------ Administrator Routes ------ */
apiRouter.post('/admin/notification',expoToken.sendMsgTokens);
apiRouter.post("/admin/walkIn", adminAuthMiddleware, application.walkIn);
apiRouter.post("/admin/readOne", adminAuthMiddleware, application.readOne);
apiRouter.put("/admin/accept", adminAuthMiddleware, application.accept);
apiRouter.put("/admin/hacker_checkIn", adminAuthMiddleware, application.hackerCheckIn);
apiRouter.put("/admin/event_checkIn", adminAuthMiddleware, application.eventCheckIn);
apiRouter.put("/admin/delete", adminAuthMiddleware, application.deleteOne);
apiRouter.get("/admin/remind_confirm", adminAuthMiddleware, application.remindConfirm);
apiRouter.get("/admin/remind_apply", adminAuthMiddleware, application.remindApply);
apiRouter.post("/admin/announcement", adminAuthMiddleware, announcement.create);
apiRouter.put("/admin/update_events", schedule.updateEvents);
// apiRouter.delete("/admin/schedule/remove",adminAuthMiddleware,schedule.remove);

/* ------ Event Routes ------ */
apiRouter.get("/schedule", schedule.read);

/* ------ Sponsor Routes ------ */
apiRouter.post("/admin/sponsor/create", adminAuthMiddleware, sponsor.create);
apiRouter.get("/sponsor/read", sponsor.read);
apiRouter.put("/admin/sponsor/update", adminAuthMiddleware, sponsor.update);
apiRouter.delete("/admin/sponsor/remove", adminAuthMiddleware, sponsor.remove);

/* ------ Expo Token routes ------ */
apiRouter.post('/expo',expoToken.addToken);

/* ------- Day of Routes --------*/
// apiRouter.post("/walkin", adminAuthMiddleware, walkIn.create);
// apiRouter.post("/checkin", adminAuthMiddleware, checkin.create);

/* ------ Workshop Routes ------ */
apiRouter.post("/workshop", workshop.create);
apiRouter.get("/workshop/read", workshop.read);
/* ------ Mentor Routes ------ */
apiRouter.post("/mentor", mentor.create);

/* ------ Volunteer Routes ------ */
// apiRouter.post("/volunteer", volunteer.create);

/* ------ Interview/Candidate Routes ------ */
// apiRouter.post("/candidate", candidate.create);
// apiRouter.get("/candidate", candidate.read);

/* ------Cabinet Routes ------ */
apiRouter.get("/cabinet/statistics", adminAuthMiddleware, cabinet.statistics);
// apiRouter.get("/cabinet/males", adminAuthMiddleware, cabinet.males);
// apiRouter.get("/cabinet/females", adminAuthMiddleware, cabinet.females);
// apiRouter.get("/cabinet/confirmed", adminAuthMiddleware, cabinet.confirmed);
// apiRouter.get("/cabinet/unconfirmed", adminAuthMiddleware, cabinet.unconfirmed);
// apiRouter.get("/cabinet/download", cabinet.download);
// apiRouter.get("/cabinet/checkin", cabinet.checkedIn);

/* ------ Live-Site Announcements ------ */
apiRouter.get("/announcement", announcement.read);
apiRouter.put("/announcement/update", adminAuthMiddleware, announcement.update);
apiRouter.delete("/announcement/remove",adminAuthMiddleware,announcement.remove);
apiRouter.post("/announcement/announce",adminAuthMiddleware,announcement.announce);

/* ------ Prereg signup Route ------ */
// Deprecating this route, this alert is no longer needed
// apiRouter.post("/live", live.create);

/* ------ Token Route ------ */
apiRouter.post("/token", token.create);

/* ------ Token Route ------ */
apiRouter.put("/lower", adminAuthMiddleware, lowerCaseEmails.lower);
// eslint-disable-next-line import/prefer-default-export
export { apiRouter };
