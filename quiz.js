// 퀴즈 데이터 생성하기
const questions = [
    {
        question: "다음 중 올바른 맞춤법은 무엇일까요?",
        choices: ["설레임", "설렘", "설래임", "설례임"],
        answer: "설렘"
    },
    {
        question: "다음 중 잘못된 표현은 무엇일까요?",
        choices: ["내 노트북이 고장이 났어.", "내일 시간 되면 연락해줘.", "그 사람과 인사를 나누었어.", "그 책을 읽어보면 재밌겠지."],
        answer: "그 책을 읽어보면 재밌겠지."
    },
    {
        question: "다음 중 '날이 저물다'와 같은 의미를 가진 표현은 무엇일까요?",
        choices: ["날이 구름지다", "날이 어두워지다", "날이 밝아오다", "날이 흐려지다"],
        answer: "날이 어두워지다"
    },
    {
        question: "'없어지다'의 올바른 표현은?",
        choices: ["없어지다", "없어하다", "사라지다", "안 보여지다"],
        answer: "사라지다"
    },
    {
        question: "다음 중 옳은 맞춤법은?",
        choices: ["짓궂다", "짖궂다", "짓굳다", "짖굳다"],
        answer: "짓궂다"
    }
];

let currentQuestion = 0;
let score = 0;
let timer;
const questionEl = document.getElementById("question");
const resultEl = document.getElementById("result");
const choicesEl = document.getElementById("choices");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer");

function displayChoices() {
    // 현재 문제와 진행도 업데이트
    progressEl.innerText = `문제 ${currentQuestion + 1} / ${questions.length}`;
    questionEl.innerText = questions[currentQuestion].question;
    
    // 기존 버튼을 모두 제거하여 초기화
    choicesEl.innerHTML = "";

    questions[currentQuestion].choices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "btn btn-outline-primary btn-block";
        button.innerText = choice;

        // 버튼 클릭 시 active 클래스 관리 및 답변 체크
        button.onclick = () => {
            clearInterval(timer);
            removeActiveClass(); // 모든 버튼의 active 상태 초기화
            button.classList.add("active"); // 클릭된 버튼에만 active 클래스 추가
            checkAnswer(choice);
        };
        choicesEl.appendChild(button);
    });

    startTimer(); // 타이머 시작
}

// 모든 버튼의 'active' 클래스 제거
function removeActiveClass() {
    const buttons = document.querySelectorAll("#choices .btn");
    buttons.forEach(btn => btn.classList.remove("active"));
}



function startTimer() {
    let timeLeft = 15;
    timerEl.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft -= 1;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            resultEl.innerText = "시간 초과! 다음 문제로 넘어갑니다.";
            checkAnswer(null); // 시간 초과 처리
        }
    }, 1000); // 타이머 간격 수정
}

function checkAnswer(selectedChoice) {
    const correctAnswer = questions[currentQuestion].answer;

    if (selectedChoice === correctAnswer) {
        resultEl.innerText = "정답입니다!";
        score += 10;
    } else {
        resultEl.innerText = selectedChoice === null ? "시간 초과!" : "틀렸습니다!";
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
    }, 1500);
}

function endQuiz() {
    // UI 초기화 함수 호출
    resetUI();
    finalScoreEl.innerText = `모든 문제를 풀었습니다! 최종 점수: ${score}점`;
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
    clearInterval(timer);
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
    
    displayChoices();
}

displayChoices();