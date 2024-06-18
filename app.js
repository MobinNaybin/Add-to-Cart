import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
  set,
  child,
  update,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDepBpm3kEWFA4WJOf_Pg0t-p5EvDs4fMI",
  authDomain: "test-41fe9.firebaseapp.com",
  databaseURL: "https://test-41fe9-default-rtdb.firebaseio.com",
  projectId: "test-41fe9",
  storageBucket: "test-41fe9.appspot.com",
  messagingSenderId: "627559809780",
  appId: "1:627559809780:web:409d36612608dbcc7314a1",
  measurementId: "G-S17J708XVX",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const usersInDB = ref(database, "Users");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");
let userId;
auth.onAuthStateChanged((user) => {
  if (user) {
    // User logged in already or has just logged in.
    console.log(user.uid);
    userId = user.uid;
    onValue(
      child(child(usersInDB, userId), "shoppingList"),
      function (snapshot) {
        if (snapshot.exists()) {
          let itemsArray = Object.entries(snapshot.val());

          clearShoppingListEl();

          for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];

            appendItemToShoppingListEl(currentItem);
          }
        } else {
          shoppingListEl.innerHTML = "No items here... yet";
        }
      }
    );
  }
});

function pushel() {
  let inputValue = inputFieldEl.value;

  push(child(child(usersInDB, userId), "shoppingList"), inputValue);

  clearInputFieldEl();
}

if (inputFieldEl && addButtonEl && shoppingListEl) {
  addButtonEl.addEventListener("click", function () {
    pushel();
  });
}

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];

  let newEl = document.createElement("li");

  newEl.textContent = itemValue;

  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(
      database,
      `Users/${userId}/shoppingList/${itemID}`
    );

    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}
