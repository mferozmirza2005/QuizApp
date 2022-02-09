// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
import {
  getDatabase,
  onValue,
  push,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/9.6.4/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4aN2o4VeloXoG8UKJ6L7_eeMmrj3sBxo",
  authDomain: "quizapp-jp.firebaseapp.com",
  databaseURL: "https://quizapp-jp-default-rtdb.firebaseio.com",
  projectId: "quizapp-jp",
  storageBucket: "quizapp-jp.appspot.com",
  messagingSenderId: "1074730364259",
  appId: "1:1074730364259:web:7a9a7cef0caa46ca74f756",
  measurementId: "G-2MR3QM66XK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Database = getDatabase();
const analytics = getAnalytics(app);

var Questions;

const dbref = ref(Database, "questions");
onValue(dbref, (snapshot) => {
  var data = snapshot.val();
  Questions = data;
});

setTimeout(() => {
  var indexVal = 0;
  var marks = 0;
  var totalMarks = 10 * Questions.length;

  function QuizQuestions() {
    var CurrentQNo = document.getElementById("CurrentQNo");
    CurrentQNo.innerHTML = indexVal + 1;

    var totalQNo = document.getElementById("totalQNo");
    totalQNo.innerHTML = Questions.length;

    var Question = document.getElementById("Question");
    Question.innerHTML = Questions[indexVal].question;

    var OptionBar = document.getElementById("OptionBar");
    for (let i = 0; i < Questions[indexVal].options.length; i++) {
      var option = `
    <div 
      class="col-xxl-6 col-xl-6 col-lg-6 col-md-12 col-sm-12 col-xs-12 py-4">
        <button class="d-flex align-items-center p-0">
          <div class="OpNum">${i + 1}</div>
          <div class="MainOp text-start ps-5">
            ${Questions[indexVal].options[i]}
          </div>
        </button>
      </div>
    `;

      OptionBar.innerHTML += option;
    }

    var ProgressBar = document.getElementById("ProgressBar");
    ProgressBar.setAttribute("max", Questions.length);
    ProgressBar.value = indexVal;

    var QPosition = document.getElementById("QPosition").childNodes[indexVal];
    QPosition.setAttribute("class", "bg-primary");

    for (let i = 0; i < OptionBar.children.length; i++) {
      OptionBar.children[i].addEventListener("click", (e) => {
        var data = e.target.innerText;
        NextQuestion(data);
      });
    }
  }

  for (let ind = 0; ind < Questions.length; ind++) {
    var QPosition = document.getElementById("QPosition");
    QPosition.innerHTML += `<li>${ind + 1}</li>`;
  }

  QuizQuestions();

  function NextQuestion(SelectedAns) {
    var correctAnswer = Questions[indexVal].correctAns;
    SelectedAns = SelectedAns;

    if (SelectedAns == correctAnswer) {
      marks += 10;
    }

    indexVal++;

    ProgressBar.value = indexVal;

    var QPosition = document.getElementById("QPosition").childNodes;
    if (indexVal < QPosition.length) {
      var QPosition = document.getElementById("QPosition").childNodes[indexVal];
      QPosition.setAttribute("class", "bg-primary");
    }

    var OptionBar = document.getElementById("OptionBar");
    OptionBar.innerHTML = "";

    if (indexVal < Questions.length) {
      QuizQuestions();
    } else {
      var Result = parseInt(((marks / totalMarks) * 100).toFixed(2));

      var QuizDiv = document.getElementById("AllQuestions");
      QuizDiv.style.display = "none";

      var resultMarks = document.getElementById("resultMarks");
      resultMarks.innerHTML = Result;

      var QuizResult = document.getElementById("result");
      QuizResult.style.display = "block";

      var dbref = push(ref(Database));

      set(ref(Database, "result/" + dbref.key), {
        id : dbref.key,
        result : Result
      });
    }
  }
}, 2000);
