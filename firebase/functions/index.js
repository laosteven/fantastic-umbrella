/**
 * React Native Starter Kit - Firebase Cloud Functions
 * - A collection of example cloud functions to use with this project
 *
 * React Native Starter App
 * https://github.com/mcnamee/react-native-starter-kit
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');
const visionClient = new vision.ImageAnnotatorClient();
let Promise = require('promise');
const cors = require('cors')({ origin: true });
const request = require('request');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

admin.initializeApp(functions.config().firebase);

/**
  * Listens for updates to /users/:userId and creates an
  * full name attribute based on the first and last names
  */
exports.cleanUserData = functions.database.ref('/users/{userId}').onWrite((event) => {
  console.log('Making Full Name for UserID:', event.params.userId);

  // Get the first and last names
  const firstName = event.data._newData.firstName || '';
  const lastName = event.data._newData.lastName || '';

  const userData = {
    fullName: `${firstName} ${lastName}`,
  };

  // Add Role if it doesn't already exist
  if (event && event.data && event.data._data && !event.data._newData.role) {
    userData.role = 'user';
  }

  return event.data.ref.update(userData);
});

/**
  * Listens for user deletion and
  * - deletes the user's reference in the database
  */
exports.deleteUserData = functions.auth.user().onDelete((event) => {
  const uid = event.data.uid;
  return admin.database().ref(`/users/${uid}`).remove();
});

exports.addSimilarImages = functions.firestore.document('photos/{document}')
    .onCreate((snap, context) => {

        console.log('SNAP', snap)
        console.log('CONTEXT', context)

        const data = snap.data();
        console.log('DATA IN IS', data)
        const photoUrl = "gs://" + data.bucket + "/" + data.fullPath;
        console.log('url is', photoUrl);

        return Promise.resolve()
            .then(() => {
                return visionClient.webDetection(photoUrl);
            })
            .then(results => {
                console.log('VISION data all is: ', results)
                const webDetection = results[0].webDetection

                let similarImages = [];
                if (webDetection.visuallySimilarImages.length) {
                    webDetection.visuallySimilarImages.forEach(image => {
                        similarImages.push(image);
                    });
                }

                console.log('similarImages', similarImages)

                db.collection('photos').doc(context.params.document).update({ similarImages })
                    .then(res => console.log('dopples added'))
                    .catch(err => console.error(err));


            })
            .catch(err => console.error(err));

    })