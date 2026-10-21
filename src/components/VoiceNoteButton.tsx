import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceNoteButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  label?: string;
}

// Support for Web Speech API in TypeScript
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal?: boolean;
    };
    length: number;
  };
}

interface CustomSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => CustomSpeechRecognition;
    webkitSpeechRecognition?: new () => CustomSpeechRecognition;
  }
}

export const VoiceNoteButton: React.FC<VoiceNoteButtonProps> = ({
  onTranscript,
  className = '',
  label = 'Detta nota vocale',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<CustomSpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechClass) {
      setIsSupported(false);
      return;
    }

    try {
      const recognition = new SpeechClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'it-IT';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        if (transcript) {
          onTranscript(transcript.trim());
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } catch {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      alert('La dettatura vocale automatica non è supportata dal browser corrente. È comunque possibile utilizzare la dettatura tramite la tastiera virtuale di iPad (tasto microfono sulla barra spaziatrice).');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      title={isListening ? 'Interrompi registrazione vocale' : 'Avvia dettatura vocale (italiano)'}
      className={`min-h-[44px] px-3 py-2 rounded-lg text-xs font-medium inline-flex items-center gap-2 transition-all active:scale-95 ${
        isListening
          ? 'bg-rose-600 text-white shadow-md animate-pulse ring-2 ring-rose-400'
          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
      } ${className}`}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4 text-white" />
          <span className="whitespace-nowrap">In ascolto... Parla ora</span>
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 text-slate-600" />
          <span className="whitespace-nowrap">{label}</span>
        </>
      )}
    </button>
  );
};
