var Questions = [
  {
    question: "whait is html ?",
    options: [
      "Hyper Text Markup language",
      "Scripting language",
      "Programming language",
      "Normal language",
    ],
    correctAns: "Hyper Text Markup language",
  },
  {
    question: "What is the correct HTML for referring to an external style sheet?",
    options: [
      "&lt;stylesheet&gt;mystyle.css&lt;/stylesheet&gt;",
      '&lt;style src="mystyle.css"&gt;',
      '&lt;link rel="stylesheet" type="text/css" href="mystyle.css"&gt;',
      '&lt;style href="mystyle.css"&gt;',
    ],
    correctAns: '<link rel="stylesheet" type="text/css" href="mystyle.css">',
  },
  {
    question: "Choose the correct HTML element for the largest heading:",
    options: [
      "&lt;h1&gt;",
      "&lt;head&gt;",
      "&lt;h5&gt;",
      "&lt;heading 6&gt;",
    ],
    correctAns: "<h1>",
  },
  {
    question: "whait is CSS ?",
    options: [
      "color style sheet",
      "Cascading Style Sheet",
      "Programming language",
      "web Styleing language",
    ],
    correctAns: "Cascading Style Sheet",
  },
  {
    question: "Where in an HTML document is the correct place to refer to an external style sheet?",
    options: [
      'At the end of the document',
      'In the &lt;body&gt; section',
      'In the &lt;head&gt; section',
      'After &lt;!Doctype html&gt;',
    ],
    correctAns: 'In the <head> section',
  },
  {
    question: "Choose the correct HTML element to define important text",
    options: [
      '&lt;i&gt;',
      '&lt;b&gt;',
      '&lt;strong&gt;',
      '&lt;important&gt;',
    ],
    correctAns: '<important>',
  },
  {
    question: "What is the correct HTML for adding a background color?",
    options: [
      '&lt;body bg="yellow"&gt;',
      '&lt;body style="background-color:yellow;"&gt;',
      '&lt;background&gt;yellow;&lt;/background&gt;',
      '&lt;body background-color:yellow;&gt;',
    ],
    correctAns: '<body style="background-color:yellow;">',
  },
  {
    question: "What is the correct HTML element for inserting a line break?",
    options: [
      "&lt;break&gt;",
      "&lt;bl&gt;",
      "&lt;br&gt;",
      "break;",
    ],
    correctAns: "<br>",
  },
  {
    question: "What does HTML stand for?",
    options: [
      " Hyperlinks and Text Markup Language",
      " Home Tool Markup Language",
      "Programming language",
      "Hyper Text Markup language",
    ],
    correctAns: "Hyper Text Markup language",
  },
  {
    question: "Which is the correct CSS syntax?",
    options: [
      'body {color: black;}',
      'body:color=black;',
      '{body:color=black;}',
      '{body;color:black;}',
    ],
    correctAns: 'body {color: black;}',
  },
];

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
        <button onclick="NextQuestion(this)" class="d-flex align-items-center p-0">
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
}

for (let ind = 0; ind < Questions.length; ind++) {
  var QPosition = document.getElementById("QPosition");
  QPosition.innerHTML += `<li>${ind + 1}</li>`;
}

QuizQuestions();

function NextQuestion(SelectedAns) {
  var correctAnswer = Questions[indexVal].correctAns;
  SelectedAns = SelectedAns.childNodes[3].innerText.trim();

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
    var QuizDiv = document.getElementById("AllQuestions");
    QuizDiv.style.display = "none";
    
    var resultMarks = document.getElementById("resultMarks");
    resultMarks.innerHTML = ((marks/totalMarks)*100).toFixed(2)

    var QuizResult = document.getElementById("result");
    QuizResult.style.display = "block";
  }
}
