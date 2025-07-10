// 🔒 Hide visual interface (headless STT widget)
document.body.style.display = 'none';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  console.log('✅ SpeechRecognition supported, initialized.');

  recognition.onstart = () => {
    console.log('🎤 Recognition started...');
  };

  recognition.onresult = (event) => {
    console.log('🧠 onresult triggered');
    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    console.log('🗣️ Transcript:', transcript);

    window.parent.postMessage(
      {
        transcribedText: transcript.trim()
      },
      '*'
    );
  };

  recognition.onerror = (event) => {
    console.error('❌ Recognition error:', event.error);
    window.parent.postMessage(
      {
        sttError: event.error
      },
      '*'
    );
  };

  recognition.onend = () => {
    console.log('🛑 Recognition ended.');
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

// 🔁 Listen for messages from parent
window.addEventListener('message', (event) => {
  const { action } = event.data || {};

  if (action === 'startListening' && recognition) {
    console.log('📩 Received: startListening');
    recognition.start();
  }

  if (action === 'stopListening' && recognition) {
    console.log('📩 Received: stopListening');
    recognition.stop();
  }
});
