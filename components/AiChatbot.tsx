import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getChatbotResponse } from '../services/geminiService';
import Icon from './common/Icon';

interface AiChatbotProps {
  // No longer needs family members
}

// Speech Recognition setup
const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
let recognition: any;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'ko-KR';
    recognition.interimResults = false;
}

const AiChatbot: React.FC<AiChatbotProps> = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string>('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom of chat history
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = useCallback(async (message: string) => {
      if (!message.trim()) return;

      const newUserMessage: ChatMessage = { role: 'user', text: message };
      setChatHistory(prev => [...prev, newUserMessage]);
      setIsChatLoading(true);
      setError('');

      try {
        const responseText = await getChatbotResponse(null, [...chatHistory, newUserMessage], message);
        const newModelMessage: ChatMessage = { role: 'model', text: responseText };
        setChatHistory(prev => [...prev, newModelMessage]);
        speakResponse(responseText);
      } catch (err) {
        console.error(err);
        const errorMessage: ChatMessage = { role: 'model', text: '죄송합니다, 답변을 생성하는 데 문제가 발생했습니다.' };
        setChatHistory(prev => [...prev, errorMessage]);
      } finally {
        setIsChatLoading(false);
      }
  }, [chatHistory]);

  const handleVoiceInput = () => {
    if (!SpeechRecognition) {
        alert('이 브라우저는 음성 인식을 지원하지 않습니다.');
        return;
    }

    if (isListening) {
        recognition.stop();
        setIsListening(false);
        return;
    }
    
    window.speechSynthesis.cancel(); // Stop any currently speaking response
    recognition.start();
    setIsListening(true);
    
    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript);
        setIsListening(false);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if(event.error === 'no-speech') {
             setError("음성이 감지되지 않았습니다. 다시 시도해주세요.");
        } else {
             setError("음성 인식 중 오류가 발생했습니다.");
        }
        setIsListening(false);
    };
    
    recognition.onend = () => {
        setIsListening(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)]">
      <h2 className="text-2xl font-bold text-slate-100 mb-4">AI 건강 챗봇</h2>
      
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 bg-surface rounded-lg space-y-4 mb-4">
        {chatHistory.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-3 rounded-lg shadow-md ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-600 text-slate-100'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isChatLoading && (
          <div className="flex justify-start">
            <div className="max-w-md p-3 rounded-lg bg-slate-600 text-slate-100">
              <span className="animate-pulse">AI가 답변을 생각 중입니다...</span>
            </div>
          </div>
        )}
         {chatHistory.length === 0 && !isChatLoading && (
          <div className="flex justify-center items-center h-full">
              <p className="text-slate-400">안녕하세요! 아래 버튼을 누르고 무엇이든 물어보세요.</p>
          </div>
         )}
      </div>

      <div className="pt-4 text-center shrink-0">
          {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
          <button 
              onClick={handleVoiceInput} 
              disabled={isChatLoading || !SpeechRecognition}
              className={`relative w-24 h-24 rounded-full transition-all duration-300 ease-in-out shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed
              ${isListening ? 'bg-red-500 hover:bg-red-600 focus:ring-red-400 animate-pulse' : 'bg-primary hover:bg-primary-dark focus:ring-primary'}`}
              aria-label={isListening ? '음성 인식 중지' : '음성으로 질문하기'}
          >
              <Icon name="microphone" className="w-12 h-12 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </button>
          <p className="mt-3 text-slate-400 h-5">
              {isChatLoading ? '' : (isListening ? '듣고 있어요...' : '버튼을 누르고 말씀하세요')}
          </p>
      </div>
    </div>
  );
};

export default AiChatbot;