const functions = require("firebase-functions");
const cors = require("cors")({origin: true});

// The configuration is now loaded from environment variables
// that you set in the Firebase environment using the command line.
// This code is now safe to commit to GitHub as it contains NO SECRETS.
const firebaseConfig = {
  apiKey: functions.config().firebase.apikey,
  authDomain: functions.config().firebase.authdomain,
  projectId: functions.config().firebase.projectid,
  storageBucket: functions.config().firebase.storagebucket,
  messagingSenderId: functions.config().firebase.messagingsenderid,
  appId: functions.config().firebase.appid,
  measurementId: functions.config().firebase.measurementid,
};

/**
 * A simple Cloud Function to securely provide the Firebase config
 * to the client-side application.
 */
exports.getConfig = functions.https.onRequest((request, response) => {
  // Use CORS to allow the request to come from your web app
  cors(request, response, () => {
    // This check is important. It verifies that you have set the
    // environment variables correctly.
    if (!firebaseConfig.apiKey) {
      functions.logger.error("Firebase config environment variables not set. Please run 'firebase functions:config:set' command.", {structuredData: true});
      response.status(500).send("Server configuration error. The developer has been notified.");
      return;
    }
    response.status(200).json(firebaseConfig);
  });
});

