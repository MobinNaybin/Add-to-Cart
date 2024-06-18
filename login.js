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
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

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

const usernameInput = document.getElementById("username");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const toggleBtn = document.querySelector(".toggle-btn");

let isLogin = true;

if (toggleBtn) {
  toggleBtn.addEventListener("click", toggleForm);
}

function toggleForm() {
  if (isLogin) {
    usernameInput.style.display = "inline";
    formTitle.textContent = "Register";
    submitBtn.textContent = "Register";
    toggleBtn.textContent = "Already have an account? Login";
  } else {
    usernameInput.style.display = "none";
    formTitle.textContent = "Login";
    submitBtn.textContent = "Login";
    toggleBtn.textContent = "Don't have an account? Register";
  }

  isLogin = !isLogin;
}

//Auth-Login-Register
if (submitBtn) {
  submitBtn.addEventListener("click", authenticate);
}
function authenticate() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  if (isLogin) {
    // Firebase login logic
    if (
      validate_email(email) == false ||
      validate_password(password) == false
    ) {
      alert("Email or Password is Wrong!!");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //Signed in

        const user = userCredential.user;
        const usersInDB = ref(database, "Users");
        const userData = {
          last_login: Date.now(),
        };
        update(child(usersInDB, user.uid), userData);
        location.replace("app.html");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
    console.log("Logging in with", email);
  } else {
    // Firebase registration logic
    if (validate_email(email) == false) {
      alert("Email is Wrong!!");
      return;
    }
    if (validate_password(password) == false) {
      alert("Password should be more than 6 characters!!");
      return;
    }
    if (validate_field(username) == false) {
      alert("Username is Empty!!");
      return;
    }
    //register-user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //Signed up
        const user = userCredential.user;
        const usersInDB = ref(database, "Users");
        const userData = {
          email: email,
          username: username,
          last_login: Date.now(),
          shoppingList: {},
        };
        set(child(usersInDB, user.uid), userData);
        alert("User Created!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
    console.log("Registering with", email);
  }
}

//Validate Functions
function validate_email(email) {
  const expression = /^[^@]+@\w+(\.\w+)+$/;
  if (expression.test(email) == true) {
    // Email is good
    return true;
  } else {
    // Email is not good
    return false;
  }
}

function validate_password(password) {
  // Firebase only accepts lengths greater than 6
  if (password.length < 6) {
    return false;
  } else {
    return true;
  }
}

function validate_field(field) {
  if (field == null) {
    return false;
  }

  if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}
