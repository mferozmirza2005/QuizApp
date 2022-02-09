// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.4/firebase-app.js";
import {
  getDatabase,
  onValue,
  update,
  remove,
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

var Login = document.getElementById("Login");
var logBody = document.getElementById("logBody");

Login.addEventListener("click", () => {
  if (logBody.style.display === "" || logBody.style.display === "none") {
    logBody.style.display = "block";
  } else {
    logBody.style.display = "none";
  }
});

var Admin = false;
var AdminLogin = document.getElementById("AdminLogin");

AdminLogin.addEventListener("click", (e) => {
  e.preventDefault();
  var dbRef = ref(Database, "admin");
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();

    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;

    if (email === data.email && pass === data.pass) {
      Admin = true;
      alert("Logged in successfully.");
      logBody.style.display = "none";
      
      var dbQuestions = document.getElementById("dbQuestions");
      var quizRef = ref(Database, "questions");
      onValue(
        quizRef,
        (snapshot) => {
          snapshot.forEach((childSnapshot) => {
            const childKey = childSnapshot.key;
            const childData = childSnapshot.val();

            // ...

            var tableRow = `
              <tr>
                <td>${childKey}</td>
                <td>${childData.question}</td>
                <td>${childData.correctAns}</td>
                <td>
                  <ol>
                    <li>${childData.options[0]}</li>
                    <li>${childData.options[1]}</li>
                    <li>${childData.options[2]}</li>
                    <li>${childData.options[3]}</li>
                  </ol>
                </td>
                <td class="text-center">
                  <div class="py-2">
                    <button onclick="editQuistion(this)" class="btn btn-outline-primary">
                      <i class="bi bi-pencil-square"></i>
                    </button>
                  </div>
                  <div>
                    <button onclick="deleteQuistion(this)" class="btn btn-outline-danger">
                      <i class="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              `;

            dbQuestions.innerHTML += tableRow;
          });
        },
        {
          onlyOnce: true,
        }
        );
        setTimeout(() => {
          console.clear();
        }, 1000);
    } else {
      alert("Oops! not logged in.");
    }
  });
});

window.editQuistion = (e) => {
  var question =
    e.parentNode.parentNode.previousElementSibling.previousElementSibling.previousElementSibling;
  var correctAns =
    e.parentNode.parentNode.previousElementSibling.previousElementSibling;
  var options = [
    e.parentNode.parentNode.previousElementSibling.children[0].children[0],
    e.parentNode.parentNode.previousElementSibling.children[0].children[1],
    e.parentNode.parentNode.previousElementSibling.children[0].children[2],
    e.parentNode.parentNode.previousElementSibling.children[0].children[3],
  ];

  if (e.children[0].classList[1] === "bi-pencil-square") {
    e.children[0].classList.remove("bi-pencil-square");
    e.children[0].classList.add("bi-check");

    for (let i = 0; i < options.length; i++) {
      var optionTxt = options[i].innerHTML;
      options[i].innerHTML = `
      <textarea id="editingOption${i}" class="form-control">${optionTxt}</textarea>
      `;
    }

    var questionTxt = question.innerHTML;
    question.innerHTML = `
    <textarea id="editingQuestion" class="form-control">${questionTxt}</textarea>
    `;

    var correctAnsTxt = correctAns.innerHTML;
    correctAns.innerHTML = `
    <textarea id="editingcorrectAns" class="form-control">${correctAnsTxt}</textarea>
    `;
  } else {
    e.children[0].classList.remove("bi-check");
    e.children[0].classList.add("bi-pencil-square");

    var allOptions = [];

    for (let i = 0; i < options.length; i++) {
      var editingOption = document.getElementById("editingOption" + i);
      options[i].innerHTML = editingOption.value;
      allOptions.push(editingOption.value);
    }
    var editingQuestion = document.getElementById("editingQuestion").value;
    question.innerHTML = editingQuestion;

    var editingcorrectAns = document.getElementById("editingcorrectAns").value;
    correctAns.innerHTML = editingcorrectAns;

    var QueNum = e.parentNode.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerText;

    update(ref(Database, "questions/" + QueNum), { question: editingQuestion });
    update(ref(Database, "questions/" + QueNum), {
      correctAns: editingcorrectAns,
    });
    update(ref(Database, "questions/" + QueNum + "/options/"), {
      0: allOptions[0],
    });
    update(ref(Database, "questions/" + QueNum + "/options/"), {
      1: allOptions[1],
    });
    update(ref(Database, "questions/" + QueNum + "/options/"), {
      2: allOptions[2],
    });
    update(ref(Database, "questions/" + QueNum + "/options/"), {
      3: allOptions[3],
    });
  }
};

window.deleteQuistion = (e) => {
  var QueNum = e.parentNode.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.innerText;
  remove(ref(Database, "questions/" + QueNum));
  e.parentNode.parentNode.parentNode.remove();
};

var addQuiz = document.getElementById("addQuiz");
var childAdded = false;

addQuiz.addEventListener("click", (e) => {
  var dbQuestions = document.getElementById("dbQuestions");

  var tr = document.createElement("tr");

  var td1 = document.createElement("td");
  var td2 = document.createElement("td");
  var td3 = document.createElement("td");
  var td4 = document.createElement("td");
  var td5 = document.createElement("td");

  var prevId = parseInt(dbQuestions.lastElementChild.children[0].innerText);
  prevId++;
  var id = document.createTextNode(prevId);
  var que = document.createElement("textarea");
  var CAns = document.createElement("textarea");
  var optList = document.createElement("ol");
  var btnDiv1 = document.createElement("div");
  var btnDiv2 = document.createElement("div");

  var optLi1 = document.createElement("li");
  var optLi2 = document.createElement("li");
  var optLi3 = document.createElement("li");
  var optLi4 = document.createElement("li");
  var btn1 = document.createElement("button");
  var btn2 = document.createElement("button");

  var opt1 = document.createElement("textarea");
  var opt2 = document.createElement("textarea");
  var opt3 = document.createElement("textarea");
  var opt4 = document.createElement("textarea");
  var btn1i = document.createElement("i");
  var btn2i = document.createElement("i");

  td5.setAttribute("class", "text-center");
  btnDiv1.setAttribute("class", "py-2");

  btn1.addEventListener("click", (e) => {
    editQuistion(e.target);
  });
  btn1.setAttribute("class", "btn btn-outline-primary");

  btn2.addEventListener("click", (e) => {
    deleteQuistion(e.target);
  });
  btn2.setAttribute("class", "btn btn-outline-danger");

  btn1i.setAttribute("class", "bi bi-pencil-square");
  btn2i.setAttribute("class", "bi bi-trash");

  if (e.target.classList[1] === "bi-plus") {
    if (childAdded == false) {
      childAdded = true;
      e.target.classList.remove("bi-plus");
      e.target.classList.add("bi-check2");

      optLi1.appendChild(opt1);
      optLi2.appendChild(opt2);
      optLi3.appendChild(opt3);
      optLi4.appendChild(opt4);
      btn1.appendChild(btn1i);
      btn2.appendChild(btn2i);

      optList.appendChild(optLi1);
      optList.appendChild(optLi2);
      optList.appendChild(optLi3);
      optList.appendChild(optLi4);
      btnDiv1.appendChild(btn1);
      btnDiv2.appendChild(btn2);

      td1.appendChild(id);
      td2.appendChild(que);
      td3.appendChild(CAns);
      td4.appendChild(optList);
      td5.appendChild(btnDiv1);
      td5.appendChild(btnDiv2);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tr.appendChild(td5);

      dbQuestions.appendChild(tr);
    }
  } else {
    que = dbQuestions.lastChild.children[1].children[0].value;
    CAns = dbQuestions.lastChild.children[2].children[0].value;

    opt1 =
      dbQuestions.lastChild.children[3].children[0].children[0].children[0]
        .value;
    opt2 =
      dbQuestions.lastChild.children[3].children[0].children[1].children[0]
        .value;
    opt3 =
      dbQuestions.lastChild.children[3].children[0].children[2].children[0]
        .value;
    opt4 =
      dbQuestions.lastChild.children[3].children[0].children[3].children[0]
        .value;
    if (
      childAdded == true &&
      que !== "" &&
      CAns !== "" &&
      opt1 !== "" &&
      opt2 !== "" &&
      opt3 !== "" &&
      opt4 !== ""
    ) {
      childAdded = false;

      e.target.classList.remove("bi-check2");
      e.target.classList.add("bi-plus");

      dbQuestions.lastChild.children[1].innerHTML = que;
      dbQuestions.lastChild.children[2].innerHTML = CAns;
      dbQuestions.lastChild.children[3].children[0].children[0].innerHTML =
        opt1;
      dbQuestions.lastChild.children[3].children[0].children[1].innerHTML =
        opt2;
      dbQuestions.lastChild.children[3].children[0].children[2].innerHTML =
        opt3;
      dbQuestions.lastChild.children[3].children[0].children[3].innerHTML =
        opt4;
    }
    var id = --prevId;
    var dbRef = ref(Database, "questions/" + id);
    set(dbRef, {  
      correctAns: CAns,
      question: que,
      options: {
        0:opt1,
        1:opt2,
        2:opt3,
        3:opt4,
      },
    });
  }
});
