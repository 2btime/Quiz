// 퀴즈 데이터 생성하기
const questions = [
    { question: "처음 시작하는 지점을 가리키는 말로, 새로운 출발을 의미하는 단어는 무엇일까요?", answer: "시발점" },
    { question: "오늘이라는 의미로, 그날을 가리키는 단어는 무엇일까요?", answer: "금일" },
    { question: "회의에서 어떤 안건을 찬성하여 통과시키는 결정을 의미하는 단어는 무엇일까요?", answer: "가결" },
    { question: "지식이나 교양이 있어 지적으로 보이는 사람이나 행동을 표현할 때 쓰는 단어로, 논리적이거나 이성적인 사고와 관련된 단어는 무엇일까요?", answer: "이지적" },
    { question: "이전에 만나본 적이 있는 사람을 가리키는 표현으로, 오랜만에 만났을 때 사용하는 단어는 무엇일까요?", answer: "구면" }
];

let currentQuestion = 0;
document.getElementById("question").innerText = questions[currentQuestion].question;

function checkAnswer() {
    const userAnswer = document.getElementById("answer").value;
    const correctAnswer = questions[currentQuestion].answer;

    if (userAnswer === correctAnswer) {
        document.getElementById("result").innerText = "정답입니다!";
        document.getElementById("hint").innerText = ""; // 힌트 초기화

        // 1초 후에 다음 문제로 넘어가도록 설정
        setTimeout(() => {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                document.getElementById("question").innerText = questions[currentQuestion].question;
                document.getElementById("answer").value = ""; // 입력창 초기화
                document.getElementById("result").innerText = ""; // 정답 메시지 초기화
            } else {
                document.getElementById("question").innerText = "모든 문제를 맞췄습니다!";
                document.getElementById("answer").style.display = "none"; // 숨기기
                document.querySelector("button").style.display = "none";
                document.getElementById("restart").style.display = "block"; // 다시 시작 버튼 보이기
            }
        }, 1000); // 1초 동안 정답 메시지를 표시
    } else {
        document.getElementById("result").innerText = "틀렸습니다. 다시 시도하세요!";
        document.getElementById("hint").innerText = `힌트: 첫 글자는 '${correctAnswer.charAt(0)}' 입니다`; // 첫 글자 힌트
    }
}
