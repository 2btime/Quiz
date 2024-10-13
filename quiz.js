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
let covers = Array.from(document.querySelectorAll(".cover")); // 모든 가림막 요소 가져오기


function fetchQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = shuffleArray(data).slice(0, 10); // 문제를 섞고, 10개만 사용
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
        disableAllButtons(); // 다른 버튼 비활성화
        checkAnswer(choice);
    };
    return button;
}

function disableAllButtons() {
    document.querySelectorAll("#choices .btn").forEach(btn => btn.disabled = true);
}

function updateProgress() {
    progressEl.innerText = `문제 ${currentQuestion + 1} / ${questions.length}`;
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

    if (isCorrect) {
        score += 10;
        revealCover(); // 정답일 때 가림막 제거
    } else {
        score -= 5;
    }

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

function revealCover() {
    if (covers.length > 0) {
        // 랜덤하게 하나의 가림막을 제거
        const randomIndex = Math.floor(Math.random() * covers.length);
        const selectedCover = covers[randomIndex];

        // 페이드 아웃 효과 후 제거
        selectedCover.style.opacity = "0";
        setTimeout(() => {
            selectedCover.style.display = "none";
        }, 500); // 0.5초 후 완전히 사라지게

        // 배열에서 제거하여 다음 문제 맞출 때 다른 가림막을 선택할 수 있게 함
        covers.splice(randomIndex, 1);
    }
}

function endQuiz() {
    resetUI();
    finalScoreEl.innerText = `모든 문제를 풀었습니다!\n 최종 점수: ${score}점`;
}

function resetUI() {
    questionEl.style.display = "none";
    choicesEl.style.display = "none";
    resultEl.style.display = "none";
    scoreEl.style.display = "none";
    progressEl.style.display = "none";
    timerEl.style.display = "none";
    restartBtn.style.display = "block";
    finalScoreEl.style.display = "block";
    finalScoreEl.classList.add("text-primary", "bg-light", "p-3", "rounded", "border");
}

function restartQuiz() {
    clearTimer();
    currentQuestion = 0;
    score = 0;
    resultEl.innerText = "";
    scoreEl.innerText = `점수: ${score}점`;

    questionEl.style.display = "block";
    choicesEl.style.display = "block";
    resultEl.style.display = "block";
    scoreEl.style.display = "block";
    progressEl.style.display = "block";
    timerEl.style.display = "block";
    restartBtn.style.display = "none";
    finalScoreEl.style.display = "none";

    // 모든 가림막 요소를 다시 가져와서 배열 초기화
    covers = Array.from(document.querySelectorAll(".cover"));

    covers.forEach(cover => {
        cover.style.display = "block"; // 가림막이 보이도록 설정
        cover.style.opacity = "1";     // 불투명도를 1로 설정하여 완전히 가림
    });

    displayChoices();
}




// 최초 실행 시 질문 데이터 로드
fetchQuestions();
