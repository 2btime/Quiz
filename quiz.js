// 퀴즈 데이터 생성하기
const questions = [
    {
        question: "다음 중 올바른 맞춤법은 무엇일까요?",
        choices: ["설레임", "설렘", "설래임", "설레임"],
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
let timer; // 타이머 변수
const questionEl = document.getElementById("question");
const resultEl = document.getElementById("result");
const choicesEl = document.getElementById("choices");
const scoreEl = document.getElementById("score");
const finalScoreEl = document.getElementById("final-score");
const restartBtn = document.getElementById("restart");
const progressEl = document.getElementById("progress");
const timerEl = document.getElementById("timer"); // 숫자 타이머 요소

function displayChoices() {
    // 현재 문제와 진행도 업데이트
    progressEl.innerText = `문제 ${currentQuestion + 1} / ${questions.length}`;
    questionEl.innerText = questions[currentQuestion].question;
    choicesEl.innerHTML = "";

    questions[currentQuestion].choices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "btn btn-outline-primary btn-block";
        button.innerText = choice;
        button.onclick = () => {
            clearInterval(timer); // 타이머 정지
            checkAnswer(choice);
            resetHover(); // 클릭 후 호버 상태 초기화
        };
        choicesEl.appendChild(button);
    });

    startTimer(); // 타이머 시작
}

function resetHover() {
    const buttons = choicesEl.getElementsByTagName("button");
    for (let button of buttons) {
        button.blur(); // 버튼에서 포커스를 제거하여 호버 효과를 없앰
    }
}

function startTimer() {
    let timeLeft = 10;
    timerEl.innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft -= 1;
        timerEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            resultEl.innerText = "시간 초과! 다음 문제로 넘어갑니다.";
            checkAnswer(null); // 시간 초과 처리
        }
    }, 1000); // 1초마다 감소
}

function checkAnswer(selectedChoice) {
    const correctAnswer = questions[currentQuestion].answer;

    if (selectedChoice === correctAnswer) {
        resultEl.innerText = "정답입니다!";
        score += 10;
    } else {
        resultEl.innerText = selectedChoice === null ? "시간 초과!" : "틀렸습니다!";
        score -= 5; // 시간 초과 또는 오답 시 점수 5점 차감
    }

    scoreEl.innerText = `점수: ${score}점`;

    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            resultEl.innerText = "";
            displayChoices();
        } else {
            // 퀴즈 종료 처리
            questionEl.style.display = "none"; 
            choicesEl.style.display = "none";
            resultEl.style.display = "none";
            scoreEl.style.display = "none";
            progressEl.style.display = "none";
            timerEl.style.display = "none";
            restartBtn.style.display = "block";
            finalScoreEl.innerText = `모든 문제를 풀었습니다! 최종 점수: ${score}점`;
            finalScoreEl.style.display = "block";
            finalScoreEl.classList.add("text-primary", "bg-light", "p-3", "rounded", "border");
        }
    }, 1000);
}

function restartQuiz() {
    clearInterval(timer); // 타이머 초기화
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

// 첫 번째 문제 표시
displayChoices();
