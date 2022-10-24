import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object

export function initAndGetFirebaseDB() {
    const firebaseConfig = {
        databaseURL: "https://rsf-crowd-data-default-rtdb.firebaseio.com/",
      };
      
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      
      
      // Initialize Realtime Database and get a reference to the service
      const database = getDatabase(app);
      return database;
}
