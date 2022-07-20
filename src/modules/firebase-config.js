// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth";
import { child, get, getDatabase, ref } from "@firebase/database";
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9ipNK6_boqbwThQlJgolni-O5iIgIl40",
  authDomain: "ditris-2244c.firebaseapp.com",
  databaseURL: "https://ditris-2244c-default-rtdb.firebaseio.com",
  projectId: "ditris-2244c",
  storageBucket: "ditris-2244c.appspot.com",
  messagingSenderId: "743373731037",
  appId: "1:743373731037:web:9552a80db8b0df8d875734"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const db = getDatabase()
export const rootRef = ref(db);
export const onlineUsersRef = child(rootRef,'users')
export const roomsRef= child(rootRef,'rooms')
export const getUsernameFromuid = async (uid) =>{
  let username;
  await get(child(onlineUsersRef,uid)).then(snapshot=>{username = snapshot.val().username})
  return username
}


