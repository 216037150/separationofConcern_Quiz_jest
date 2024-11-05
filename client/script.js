import { questions } from '../UtilFiles/quizQuestions.js';
import { validatePlayerName } from '../UtilFiles/validatePlayerName.js';
import { Utils } from '../storage/localStorage.js';
import { fetchHighScores } from '../server/server.js';
import {saveScoreToDb} from '../server/server.js'

// DOM elements
let currentQuestion = 0;
let score = 0;

function startQuiz() {
  const playerName = document.getElementById('player-name').value.trim();
  
  try {
      validatePlayerName(playerName);
      Utils.saveName(playerName);
      
      document.getElementById('name-prompt').classList.add('hidden');
      document.getElementById('quiz-container').classList.remove('hidden');
      
      loadQuestion();
      HelloPlusName();
      nextButton();
  } catch (error) {
      console.error(error.message);
      alert(error.message);
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

  // Hide the "Next" button initially for each question
  document.getElementById('next-btn').classList.add('hidden');
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
  document.getElementById('quiz-container').classList.add('hidden');
  const resultContainer = document.getElementById('result-container');
  resultContainer.classList.remove('hidden');
  
  const percentage = (score / questions.length) * 100;
  document.getElementById('result-text').textContent = `${playerName}, you scored ${score} out of ${questions.length} (${percentage.toFixed(2)}%)`;
  
  Utils.saveScore(playerName, score);
  displayHighScores();
}

function displayHighScores() {
  const scoresList = document.getElementById('scores-list');
  scoresList.innerHTML = '<h3>High Scores</h3>';
  
  const highScores = Utils.getHighScores();
  highScores.forEach((scoreData, index) => {
      const scoreElement = document.createElement('div');
      scoreElement.className = 'score-item';
      const date = new Date(scoreData.date).toLocaleDateString();
      scoreElement.textContent = `${index + 1}. ${scoreData.name} - ${scoreData.score} points (${date})`;
      scoresList.appendChild(scoreElement);
  });
}

function resetQuiz() {
  currentQuestion = 0;
  score = 0;

  document.getElementById('name-prompt').classList.remove('hidden');
  document.getElementById('quiz-container').classList.add('hidden');
  document.getElementById('result-container').classList.add('hidden');
  document.getElementById('player-name').value = '';
}

function init() {
  document.getElementById('start-btn').addEventListener('click', startQuiz());
  document.getElementById('restart-btn').addEventListener('click', resetQuiz());
}

document.addEventListener('DOMContentLoaded', init);
