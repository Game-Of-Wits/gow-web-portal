export const environment = {
  production: true,
  firebase: {
    projectId: process.env['NG_APP_FIREBASE_PROJECT_ID'],
    appId: process.env['NG_APP_FIREBASE_APP_ID'],
    databaseURL: process.env['NG_APP_FIREBASE_DATABASE_URL'],
    storageBucket: process.env['NG_APP_FIREBASE_STORAGE_BUCKET_URL'],
    apiKey: process.env['NG_APP_FIREBASE_API_KEY'],
    authDomain: process.env['NG_APP_FIREBASE_AUTH_DOMAIN'],
    messagingSenderId: process.env['NG_APP_FIREBASE_MESSAGING_SENDER_ID'],
    measurementId: process.env['NG_APP_FIREBASE_MEASUREMENT_ID']
  }
}
