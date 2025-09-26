const functions = require("firebase-functions");
const admin = require("firebase-admin");

// This initializes the Admin SDK, allowing the function to manage users
admin.initializeApp();

// =================================================================
// ==  1. VERY IMPORTANT: SET YOUR AUTHORIZED EMAIL ADDRESS BELOW ==
// =================================================================
const ALLOWED_EMAIL = "2023.hardeep@gmail.com";
// =================================================================


/**
 * This Cloud Function triggers automatically when any new user is created.
 * It checks if the new user's email is the one you have allowed.
 * If the email is not allowed, it immediately deletes the user account.
 * This is a server-side check and cannot be bypassed.
 */
exports.enforceEmailWhitelist = functions.auth.user().onCreate(async (user) => {
  const userEmail = user.email;

  // Log the email of the user trying to sign up for your records.
  functions.logger.log(`New user created: ${userEmail}. Checking against the allowed email.`);

  // Check if the user's email is the one on the whitelist.
  if (userEmail !== ALLOWED_EMAIL) {
    try {
      // If the email is NOT allowed, delete the user account from Firebase Authentication.
      await admin.auth().deleteUser(user.uid);
      functions.logger.log(`SECURITY: Successfully deleted unauthorized user: ${userEmail}`);
      return null;
    } catch (error) {
      functions.logger.error(`Error deleting unauthorized user ${userEmail}:`, error);
      return null;
    }
  } else {
    // If the email IS allowed, do nothing and let the user be created successfully.
    functions.logger.log(`Authorized user signed up successfully: ${userEmail}`);
    return null;
  }
});

