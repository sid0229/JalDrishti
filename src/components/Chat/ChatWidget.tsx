import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, X, Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';

const GEMINI_API_KEY = 'AIzaSyCiknT27VA2Io1YdKZht4FEUhTAZJHJg18'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const JalMitra = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Text-to-Speech functionality
  const speakText = async (text: string) => {
    try {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Get available voices and prefer a natural sounding one
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') || 
        voice.default
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Text-to-speech error:', error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are JalMitra, a helpful AI assistant for National Groundwater Status and Alerts. Please respond in the same language as the user's message,if it is english,respond in english only,if it is hindi,respond in hindi only and so on.Answer generic queries also efficiently. User message: ${inputText}`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.candidates[0].content.parts[0].text,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsFullscreen(false);
    stopSpeaking();
  };

  return (
    <div className="fixed z-50">
      {/* Floating Chat Button */}
      {!isOpen && (
        <div
          className="fixed bottom-6 right-6 cursor-pointer transform transition-all duration-300 hover:scale-110 hover:-translate-y-1"
          onClick={() => setIsOpen(true)}
        >
          <div className="relative">
            {/* Gradient Background */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#014d86] to-[#2ca58d] p-0.5 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-[#014d86]" />
              </div>
            </div>
            {/* Pulse Animation */}
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-br from-[#014d86] to-[#2ca58d] opacity-20 animate-ping"></div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      {isOpen && (
        <div
          className={`fixed transition-all duration-500 ease-in-out ${
            isFullscreen
              ? 'inset-0'
              : 'bottom-6 right-6 w-96 h-[500px]'
          }`}
        >
          <div className="w-full h-full bg-[#014d86] rounded-2xl shadow-2xl overflow-hidden border border-gray-600 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#014d86] to-[#2ca58d] p-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-[#014d86]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">JalMitra</h3>
                  <p className="text-white/80 text-xs">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={isSpeaking ? stopSpeaking : () => {}}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                  title={isSpeaking ? "Stop speaking" : "Speech available"}
                >
                  {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                  {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                </button>
                <button
                  onClick={closeChat}
                  className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center text-white/80 h-full">
                  <MessageCircle className="w-12 h-12 text-white/60 mb-3" />
                  <p className="text-lg font-medium">Welcome to JalMitra!</p>
                  <p className="text-sm text-white/60">How can I help you today?</p>
                  <p className="text-xs text-white/50 mt-2">Click the speaker icon to hear responses</p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={`p-3 rounded-2xl transition-all duration-200 ${
                        message.isUser
                          ? 'bg-gradient-to-r from-[#2ca58d] to-[#014d86] text-white rounded-br-sm'
                          : 'bg-white/10 backdrop-blur-sm text-white rounded-bl-sm border border-white/20'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                    <div className="flex items-center justify-between mt-1 px-1">
                      <p className="text-xs text-white/50">
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      {!message.isUser && (
                        <button
                          onClick={() => speakText(message.text)}
                          className="text-white/50 hover:text-white/80 transition-colors p-1 hover:bg-white/10 rounded"
                          disabled={isSpeaking}
                          title="Read aloud"
                        >
                          <Volume2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 backdrop-blur-sm p-3 rounded-2xl rounded-bl-sm border border-white/20">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-[#003366] border-t border-white/20 flex-shrink-0">
              <div className="flex items-end space-x-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message…"
                    className="w-full resize-none rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm p-3 pr-4 focus:outline-none focus:ring-2 focus:ring-[#2ca58d] focus:border-transparent transition-all duration-200 text-sm max-h-24 text-white placeholder-white/60"
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  className="bg-gradient-to-r from-[#2ca58d] to-[#014d86] text-white p-3 rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JalMitra;