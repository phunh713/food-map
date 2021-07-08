import firebase from "firebase/app";
import "firebase/storage";

firebase.initializeApp({
	apiKey: "AIzaSyAg413UQq7zH1AaTf6J9wQNpgtepMPIcrA",
	authDomain: "react-food-map.firebaseapp.com",
	databaseURL: "https://react-food-map-default-rtdb.firebaseio.com",
	projectId: "react-food-map",
	storageBucket: "react-food-map.appspot.com",
	messagingSenderId: "51011340474",
	appId: "1:51011340474:web:83c72d0b8483147d455a83",
});

export const storage = firebase.storage();
export default firebase;
