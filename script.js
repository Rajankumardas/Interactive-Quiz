// Quiz questions data
const quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        hint: "It's known as the City of Light.",
        explanation: "Paris is the capital and most populous city of France. It is known as the 'City of Light' and is famous for its cultural landmarks like the Eiffel Tower and the Louvre Museum."
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        hint: "It's the fourth planet from the Sun.",
        explanation: "Mars is often called the 'Red Planet' because of its reddish appearance, which is caused by iron oxide (rust) on its surface."
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["African Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: 1,
        hint: "It lives in the ocean.",
        explanation: "The Blue Whale is the largest mammal in the world, reaching lengths of up to 100 feet and weights of up to 200 tons."
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
        correctAnswer: 2,
        hint: "He was a Renaissance artist and inventor.",
        explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1506. It is now displayed at the Louvre Museum in Paris."
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correctAnswer: 2,
        hint: "It comes from the Latin word 'aurum'.",
        explanation: "The chemical symbol for gold is Au, derived from the Latin word 'aurum' which means gold."
    }
];

// DOM elements
const questionNumberElement = document.getElementById('question-number');
const questionTextElement = document.getElementById('question-text');
const optionsListElement = document.getElementById('options-list');
const prevButton = document.getElementById('prev-btn');
const nextButton = document.getElementById('next-btn');
const hintButton = document.getElementById('hint-btn');
const progressBar = document.getElementById('progress-bar');
const timerElement = document.getElementById('timer');
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const scoreElement = document.getElementById('score');
const messageElement = document.getElementById('message');
const explanationsElement = document.getElementById('explanations');
const restartButton = document.getElementById('restart-btn');
const hintContainer = document.getElementById('hint-container');
const hintTextElement = document.getElementById('hint-text');

// Quiz state
let currentQuestion = 0;
let userAnswers = new Array(quizQuestions.length).fill(null);
let timeLeft = 60; // 60 seconds per question
let timerInterval;

// Initialize the quiz
function initQuiz() {
    displayQuestion();
    startTimer();
    
    // Event listeners
    prevButton.addEventListener('click', goToPreviousQuestion);
    nextButton.addEventListener('click', goToNextQuestion);
    hintButton.addEventListener('click', toggleHint);
    restartButton.addEventListener('click', restartQuiz);
}

// Display current question
function displayQuestion() {
    const question = quizQuestions[currentQuestion];
    
    // Update question number and text
    questionNumberElement.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;
    questionTextElement.textContent = question.question;
    
    // Update progress bar
    progressBar.style.width = `${((currentQuestion + 1) / quizQuestions.length) * 100}%`;
    
    // Clear previous options
    optionsListElement.innerHTML = '';
    
    // Add options
    question.options.forEach((option, index) => {
        const li = document.createElement('li');
        li.className = 'option';
        if (userAnswers[currentQuestion] === index) {
            li.classList.add('selected');
        }
        
        li.innerHTML = `
            <input type="radio" name="answer" id="option-${index}" value="${index}" 
                ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
            <label for="option-${index}">${option}</label>
        `;
        
        li.addEventListener('click', () => selectOption(index));
        optionsListElement.appendChild(li);
    });
    
    // Update buttons
    prevButton.disabled = currentQuestion === 0;
    nextButton.textContent = currentQuestion === quizQuestions.length - 1 ? 'Submit' : 'Next';
    
    // Reset hint state
    hintContainer.classList.add('hidden');
    hintButton.textContent = 'Show Hint';
    hintTextElement.textContent = question.hint;
}

// Select an option
function selectOption(optionIndex) {
    userAnswers[currentQuestion] = optionIndex;
    
    // Update visual selection
    document.querySelectorAll('.option').forEach((opt, idx) => {
        if (idx === optionIndex) {
            opt.classList.add('selected');
            opt.querySelector('input').checked = true;
        } else {
            opt.classList.remove('selected');
        }
    });
}

// Toggle hint visibility
function toggleHint() {
    hintContainer.classList.toggle('hidden');
    hintButton.textContent = hintContainer.classList.contains('hidden') ? 'Show Hint' : 'Hide Hint';
}

// Navigate to previous question
function goToPreviousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        resetTimer();
        displayQuestion();
    }
}

// Navigate to next question or submit quiz
function goToNextQuestion() {
    if (userAnswers[currentQuestion] === null) {
        alert('Please select an answer before proceeding.');
        return;
    }
    
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        resetTimer();
        displayQuestion();
    } else {
        submitQuiz();
    }
}

// Start timer for current question
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 60;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            if (currentQuestion < quizQuestions.length - 1) {
                goToNextQuestion();
            } else {
                submitQuiz();
            }
        }
    }, 1000);
}

// Reset timer
function resetTimer() {
    clearInterval(timerInterval);
    startTimer();
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `Time left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Change color when time is running out
    if (timeLeft <= 10) {
        timerElement.style.color = '#ff4757';
    } else {
        timerElement.style.color = '#4a00e0';
    }
}

// Submit quiz and show results
function submitQuiz() {
    clearInterval(timerInterval);
    
    // Calculate score
    const score = userAnswers.reduce((total, answer, index) => {
        return total + (answer === quizQuestions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    // Display score
    scoreElement.textContent = `${score} / ${quizQuestions.length}`;
    
    // Display message based on score
    if (score === quizQuestions.length) {
        messageElement.textContent = "Perfect! You got all questions right!";
    } else if (score >= quizQuestions.length * 0.7) {
        messageElement.textContent = "Great job! You have good knowledge.";
    } else if (score >= quizQuestions.length * 0.5) {
        messageElement.textContent = "Good effort! Keep learning.";
    } else {
        messageElement.textContent = "Keep studying and try again!";
    }
    
    // Display explanations
    explanationsElement.innerHTML = '<h3>Answer Explanations:</h3>';
    quizQuestions.forEach((question, index) => {
        const isCorrect = userAnswers[index] === question.correctAnswer;
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
        explanationDiv.innerHTML = `
            <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
            <p class="${isCorrect ? 'correct' : 'incorrect'}"><strong>Your answer:</strong> ${userAnswers[index] !== null ? question.options[userAnswers[index]] : 'Not answered'} ${isCorrect ? '✓' : '✗'}</p>
            <p><strong>Correct answer:</strong> ${question.options[question.correctAnswer]}</p>
            <p><strong>Explanation:</strong> ${question.explanation}</p>
        `;
        explanationsElement.appendChild(explanationDiv);
    });
    
    // Show result container, hide question container
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
}

// Restart quiz
function restartQuiz() {
    currentQuestion = 0;
    userAnswers = new Array(quizQuestions.length).fill(null);
    resultContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    resetTimer();
    displayQuestion();
}

// Initialize the quiz when the page loads
window.addEventListener('load', initQuiz);