// Hide everything (invisible widget)
document.body.style.display = 'none';

// Setup SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event) => {
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    // ✅ Send transcript to Wix (parent window)
    window.parent.postMessage(
      {
        type: 'holly-transcript',
        transcript: transcript.trim(),
      },
      '*'
    );
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    window.parent.postMessage(
      {
        type: 'holly-error',
        error: event.error,
      },
      '*'
    );
  };

  recognition.onend = () => {
    window.parent.postMessage(
      {
        type: 'holly-status',
        status: 'stopped',
      },
      '*'
    );
  };
} else {
  console.warn('SpeechRecognition not supported.');
  window.parent.postMessage(
    {
      type: 'holly-error',
      error: 'SpeechRecognition not supported in this browser.',
    },
    '*'
  );
}

// 🔁 Listen for control messages from Wix
window.addEventListener('message', (event) => {
  const { data } = event;
  if (data === 'start-holly-listening' && recognition) {
    recognition.start();
  }
  if (data === 'stop-holly-listening' && recognition) {
    recognition.stop();
  }
});
