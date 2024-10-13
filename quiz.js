const images = ['./img1.jpg', './img2.jpg', './img3.jpg', './img4.jpg'];
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

// 문제 데이터 불러오기 함수
function fetchQuestions() {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = shuffleArray(data).slice(0, 10); // 문제를 섞고, 10개만 사용
            setRandomImage(); // 퀴즈 시작 시 랜덤 이미지 한 번 설정
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

// 랜덤 이미지 설정 함수
function setRandomImage() {
    const randomIndex = Math.floor(Math.random() * images.length);
    document.querySelector('.image-container').style.backgroundImage = `url(${images[randomIndex]})`;
}

// 문제와 보기 표시 함수
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

// 선택지 버튼 생성 함수
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

// 모든 버튼 비활성화
function disableAllButtons() {
    document.querySelectorAll("#choices .btn").forEach(btn => btn.disabled = true);
}

// 진행도 업데이트 함수
function updateProgress() {
    progressEl.innerText = `문제 ${currentQuestion + 1} / ${questions.length}`;
}

// 타이머 시작 함수
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

// 타이머 제거 함수
function clearTimer() {
    clearInterval(timer);
}

// 정답 체크 함수
function checkAnswer(selectedChoice) {
    const correctAnswer = questions[currentQuestion].answer;
    const isCorrect = selectedChoice === correctAnswer;

    resultEl.innerText = isCorrect ? "정답입니다!" : (selectedChoice === null ? "시간 초과!" : "틀렸습니다!");
    resultEl.style.color = isCorrect ? "blue" : "red"; // 정답일 때는 파란색, 틀렸을 때는 빨간색

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

// 가림막 랜덤 제거 함수
function revealCover() {
    if (covers.length > 0) {
        const randomIndex = Math.floor(Math.random() * covers.length);
        const selectedCover = covers[randomIndex];

        selectedCover.style.opacity = "0";
        setTimeout(() => {
            selectedCover.style.display = "none";
        }, 500); // 0.5초 후 완전히 사라지게

        covers.splice(randomIndex, 1);
    }
}

// 퀴즈 종료 함수
function endQuiz() {
    resetUI();
    finalScoreEl.innerText = `모든 문제를 풀었습니다!\n 최종 점수: ${score}점`;
}

// UI 리셋 함수
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

// 퀴즈 재시작 함수
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

    covers = Array.from(document.querySelectorAll(".cover"));
    covers.forEach(cover => {
        cover.style.display = "block"; 
        cover.style.opacity = "1";     
    });

    setRandomImage(); // 퀴즈 재시작 시 이미지 설정
    displayChoices();
}

// 최초 실행 시 질문 데이터 로드
fetchQuestions();
