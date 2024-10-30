import {questions}  from '../UtilFiles/quizQuestions.js';
import { validatePlayerName } from '../UtilFiles/validatePlayerName.js';
import {Utils} from '../storage/localStorage.js';


// DOM elements
let currentQuestion = 0;
let score = 0;
function startQuiz() {
  const namePrompt = document.getElementById('name-prompt');
  const quizContainer = document.getElementById('quiz-container');
  const playerName = document.getElementById('player-name').value.trim();

  try {
      validatePlayerName(playerName);  
      Utils.saveName(playerName);
      namePrompt.classList.add('hidden');
      quizContainer.classList.remove('hidden');
      loadQuestion();
      HelloPlusName();
      nextButton()
  } catch (error) {
      console.error(error.message);
  }
}

function nextButton() {
  document.getElementById('next-btn').addEventListener('click', () => {
      currentQuestion++;
      if (currentQuestion >= questions.length) {
          endQuiz();
      } else {
          loadQuestion();
          document.getElementById('next-btn').classList.add('hidden');
      }
  });
}

function HelloPlusName() {
  const quizContainer = document.getElementById('quiz-container');
  const myName = document.getElementById('myName');
  const playerName = Utils.getCurrentPlayer();

  myName.textContent = `Hello, ${playerName}!`;
  myName.style.marginBottom = '30px';
  myName.style.marginTop = '-5px';
  myName.style.color = 'green'; 
  quizContainer.insertBefore(myName, quizContainer.firstChild);
}


function loadQuestion() {
  if (currentQuestion >= questions.length) {
      endQuiz();
      return;
  }

  const question = questions[currentQuestion];
  document.getElementById('question').textContent = question.question;
  const optionsContainer = document.getElementById('options');
  optionsContainer.innerHTML = '';

  for (let i = 0; i < question.options.length; i++) {
      const button = document.createElement('button');
      button.textContent = question.options[i];
      button.className = 'option-btn';
      button.onclick = () => checkAnswer(i);
      optionsContainer.appendChild(button);
  }
}

function checkAnswer(selectedOption) {
  const correct = questions[currentQuestion].correct;
  if (selectedOption === correct) {
      score++;
  }
  document.getElementById('next-btn').classList.remove('hidden');
}

function endQuiz() {
  const playerName = Utils.getCurrentPlayer();
  const quizContainer = document.getElementById('quiz-container');
  const resultContainer = document.getElementById('result-container');
  const resultText = document.getElementById('result-text');
  
  quizContainer.classList.add('hidden');
  resultContainer.classList.remove('hidden');
  
  const percentage = (score / questions.length) * 100;
  resultText.textContent = `${playerName}, you scored ${score} out of ${questions.length} (${percentage}%)`;
  
  Utils.saveScore(playerName, score);
  displayHighScores();
}

function displayHighScores() {
  const scoresList = document.getElementById('scores-list');
  scoresList.innerHTML = '<h3>High Scores</h3>';
  
  const highScores = Utils.getHighScores();
  for (let i = 0; i < highScores.length; i++) {
      const scoreElement = document.createElement('div');
      scoreElement.className = 'score-item';
      const date = new Date(highScores[i].date).toLocaleDateString();
      scoreElement.textContent = `${i + 1}. ${highScores[i].name} - ${highScores[i].score} points (${date})`;
      scoresList.appendChild(scoreElement);
  }
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;
  const namePrompt = document.getElementById('name-prompt');
  const quizContainer = document.getElementById('quiz-container');
  const resultContainer = document.getElementById('result-container');
  
  quizContainer.classList.add('hidden');
  resultContainer.classList.add('hidden');
  namePrompt.classList.remove('hidden');
  document.getElementById('player-name').value = '';
}

// Initialization
function init() {
  document.getElementById('start-btn').addEventListener('click', startQuiz);
  document.getElementById('restart-btn').addEventListener('click', resetQuiz);
}
document.addEventListener('DOMContentLoaded', init);
