let currentQuestion = 0;
let score = 0;
let timer;
let questions = [];
const questionEl = document.getElementById("question");
const resultEl = document.getElementById("result");
const choicesEl = document.getElementById("choices");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");

function fetchQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = shuffleArray(data).slice(0, 10); // 문제를 섞고, 10개만 사용
            console.log("Shuffled Questions: ", questions); // 섞인 문제를 콘솔에 출력
            displayChoices();
        })
        .catch(error => console.error('Error loading questions:', error));
}

// 배열을 무작위로 섞는 함수
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayChoices() {
    updateProgress();
    questionEl.innerText = questions[currentQuestion].question;
    choicesEl.innerHTML = "";

    questions[currentQuestion].choices.forEach(choice => {
        const button = createChoiceButton(choice);
        choicesEl.appendChild(button);
    });

    startTimer();
}

function createChoiceButton(choice) {
    const button = document.createElement("button");
    button.className = "btn btn-outline-primary btn-block";
    button.innerText = choice;

    button.onclick = () => {
        clearTimer();
        toggleActiveClass(button);
        disableAllButtons(); // 모든 버튼을 비활성화
        checkAnswer(choice);
    };
    return button;
}

// 모든 선택 버튼 비활성화 함수
function disableAllButtons() {
    document.querySelectorAll("#choices .btn").forEach(btn => btn.disabled = true);
}

function updateProgress() {
    progressEl.innerText = `문제 ${currentQuestion + 1} / ${questions.length}`;
}

function toggleActiveClass(selectedButton) {
    document.querySelectorAll("#choices .btn").forEach(btn => btn.classList.remove("active"));
    selectedButton.classList.add("active");
}

function startTimer() {
    let timeLeft = 15;
    timerEl.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft -= 1;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearTimer();
            resultEl.innerText = "시간 초과! 다음 문제로 넘어갑니다.";
            checkAnswer(null);
        }
    }, 1000);
}

function clearTimer() {
    clearInterval(timer);
}

function checkAnswer(selectedChoice) {
    const correctAnswer = questions[currentQuestion].answer;
    const isCorrect = selectedChoice === correctAnswer;

    resultEl.innerText = isCorrect ? "정답입니다!" : (selectedChoice === null ? "시간 초과!" : "틀렸습니다!");
    score += isCorrect ? 10 : -5;
    scoreEl.innerText = `점수: ${score}점`;

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            resultEl.innerText = "";
            displayChoices();
        } else {
            endQuiz();
        }
    }, 1000);
}

function toggleUI(showQuiz) {
    const displayQuiz = showQuiz ? "block" : "none";
    const displayResult = showQuiz ? "none" : "block";
    
    questionEl.style.display = displayQuiz;
    choicesEl.style.display = displayQuiz;
    resultEl.style.display = displayQuiz;
    scoreEl.style.display = displayQuiz;
    progressEl.style.display = displayQuiz;
    timerEl.style.display = displayQuiz;
    restartBtn.style.display = displayResult;
    finalScoreEl.style.display = displayResult;
}

function endQuiz() {
    toggleUI(false);
    finalScoreEl.innerText = `모든 문제를 풀었습니다! 최종 점수: ${score}점`;
    finalScoreEl.classList.add("text-primary", "bg-light", "p-3", "rounded", "border");
}

function restartQuiz() {
    clearTimer();
    currentQuestion = 0;
    score = 0;
    scoreEl.innerText = `점수: ${score}점`;
    resultEl.innerText = "";
    toggleUI(true);
    fetchQuestions(); // 퀴즈 재시작 시 문제도 다시 섞기 위해 fetchQuestions 호출
}

// 최초 실행 시 질문 데이터 로드
fetchQuestions();
