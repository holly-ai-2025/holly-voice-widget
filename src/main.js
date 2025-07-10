// 🔒 Hide visual interface (this is a headless STT widget)
document.body.style.display = 'none';

// 🎙️ Setup SpeechRecognition
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

    // ✅ Send transcript to Wix parent
    window.parent.postMessage(
      {
        transcribedText: transcript.trim()
      },
      '*'
    );
  };

  recognition.onerror = (event) => {
    console.error('🎤 Speech recognition error:', event.error);
    window.parent.postMessage(
      {
        sttError: event.error
      },
      '*'
    );
  };

  recognition.onend = () => {
    console.log('🎤 Recognition ended.');
    window.parent.postMessage(
      {
        sttStatus: 'stopped'
      },
      '*'
    );
  };
} else {
  console.warn('🚫 SpeechRecognition not supported.');
  window.parent.postMessage(
    {
      sttError: 'SpeechRecognition not supported in this browser.'
    },
    '*'
  );
}

// 🔁 Listen for messages from parent (Wix)
window.addEventListener('message', (event) => {
  const { action } = event.data || {};

  if (action === 'startListening' && recognition) {
    console.log('🎙️ Received: startListening');
    recognition.start();
  }

  if (action === 'stopListening' && recognition) {
    console.log('🛑 Received: stopListening');
    recognition.stop();
  }
});
