const questions = [

{
question: "Which animal feels most like you?",
answers: [
"Whale",
"Falcon",
"Horse",
"Fox"
]
},

{
question: "Where would you rather be right now?",
answers: [
"On a mountain trail",
"By the ocean",
"In the kitchen cooking",
"Somewhere completely new"
]
},

{
question: "What is your hidden superpower?",
answers: [
"Sprinting faster than expected",
"Making people feel safe",
"Creating beauty with words",
"Quiet determination"
]
},

{
question: "What makes you feel most alive?",
answers: [
"Running outdoors",
"Learning something new",
"Writing poetry",
"Exploring"
]
}

];

let current = 0;

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const resultEl = document.getElementById("result");
const finalMessage = document.getElementById("finalMessage");

function showQuestion(){

if(current >= questions.length){

answersEl.style.display = "none";

resultEl.style.display = "block";

finalMessage.innerText =
"You are one of the most extraordinary people I have ever known.\n\n" +
"You move through the world with strength, care, and quiet power.\n\n" +
"I made this because you deserve things that exist just for you.";

return;

}

const q = questions[current];

questionEl.innerHTML =
"<h2>" + q.question + "</h2>";

answersEl.innerHTML = "";

q.answers.forEach(answer => {

const btn = document.createElement("button");

btn.className = "tile";

btn.style.gridColumn = "span 6";

btn.innerHTML = "<h2>" + answer + "</h2>";

btn.onclick = () => {

current++;

showQuestion();

};

answersEl.appendChild(btn);

});

}

showQuestion();
