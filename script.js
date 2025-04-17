const questionEl = document.getElementById('question');
const optionsEl  = document.getElementById('options');
const endQuizBtn = document.getElementById('endQuiz');
const resultEl   = document.querySelector('.result');
const scoreEl    = document.getElementById('score');
const jokeEl     = document.querySelector('.joke');
const jokeText   = document.getElementById('jokeText');

let score = 0;
let total = 0;
let quizActive = true;

loadQuestion();

endQuizBtn.addEventListener('click', () => {
  quizActive = false;
  showResult();
});

function loadQuestion() {
  if (!quizActive) return;
  optionsEl.innerHTML = '';
  questionEl.textContent = 'Loading…';

  fetch('https://opentdb.com/api.php?amount=1&type=multiple')
    .then(res => res.json())
    .then(data => {
      const q = data.results[0];
      questionEl.innerHTML = q.question;

    
      const opts = [...q.incorrect_answers, q.correct_answer];
      shuffle(opts);

      opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.innerHTML = opt;
        btn.onclick = () => handleAnswer(opt, q.correct_answer);
        optionsEl.appendChild(btn);
      });
    })
    .catch(err => {
      console.error('Fetch failed, retrying...', err);
      
      if (quizActive) loadQuestion();
    });
}

function handleAnswer(selected, correct) {
  if (!quizActive) return;
  total++;
 
  Array.from(optionsEl.children).forEach(b => b.disabled = true);

  if (selected === correct) score++;

 
  const fb = document.createElement('div');
  fb.textContent =
    selected === correct
      ? '✅ Correct!'
      : `❌ Wrong! Correct Answer: ${correct}`;
  fb.style.color = selected === correct ? 'lime' : 'salmon';
  fb.style.marginTop = '16px';
  optionsEl.appendChild(fb);


  setTimeout(() => {
    if (quizActive) loadQuestion();
  }, 2000);
}

function showResult() {
  document.querySelector('.quiz-container').style.display = 'none';
  resultEl.style.display = 'block';
  scoreEl.textContent = `You got ${score} out of ${total} correct.`;
  fetchJoke();
}

function fetchJoke() {
  fetch('https://v2.jokeapi.dev/joke/Any?type=single')
    .then(r => r.json())
    .then(data => {
      jokeText.textContent = data.joke;
      jokeEl.style.display = 'block';
    })
    .catch(() => {
      jokeText.textContent = "Couldn't fetch a joke 😢";
      jokeEl.style.display = 'block';
    });
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
