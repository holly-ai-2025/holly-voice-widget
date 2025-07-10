import './style.css';

const app = document.querySelector('#app');
app.innerHTML = `
  <div>
    <h1>🎤 Mic Test</h1>
    <button id="startBtn">Start Listening</button>
    <button id="stopBtn" disabled>Stop Listening</button>
    <p id="status">Click start to begin</p>
    <p id="transcript"></p>
  </div>
`;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const transcriptEl = document.getElementById('transcript');
const statusEl = document.getElementById('status');

let recognition;

if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  statusEl.textContent = 'SpeechRecognition not supported in this browser.';
  startBtn.disabled = true;
} else {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    statusEl.textContent = 'Listening...';
    startBtn.disabled = true;
    stopBtn.disabled = false;
  };

  recognition.onend = () => {
    statusEl.textContent = 'Stopped.';
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };

  recognition.onerror = (event) => {
    console.error('Recognition error:', event.error);
    statusEl.textContent = `Error: ${event.error}`;
  };

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    transcriptEl.textContent = transcript;
  };

  startBtn.addEventListener('click', () => {
    recognition.start();
  });

  stopBtn.addEventListener('click', () => {
    recognition.stop();
  });
}
