// src/components/AvatarQA.jsx
import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

const AvatarQA = () => {
  // Sample questions the avatar will ask
  const sampleQuestions = [
    "Can you explain the concept of variable scoping in JavaScript?",
    "What's the difference between functional and object-oriented programming?",
    "How would you implement a linked list data structure?",
    "Explain the box model in CSS.",
    "What are React hooks and why are they useful?",
  ];

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [conversation, setConversation] = useState([]);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState(""); // For tracking current recording
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(new Audio());
  const recognitionRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = ''; // Start with empty string for each new recording
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += text;
          } else {
            interimTranscript += text;
          }
        }
        
        setCurrentTranscript(finalTranscript + interimTranscript);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech Recognition Error", event.error);
      };
    }
    
    // Initialize camera
    initCamera();
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      // Clean up video stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Initialize camera
  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  // Auto-scroll to bottom of conversation
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversation]);

  // Text-to-speech setup
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // You can customize voice properties
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  };

  // Ask a random question
  const askQuestion = () => {
    const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
    const question = sampleQuestions[randomIndex];
    setCurrentQuestion(question);
    setConversation(prev => [...prev, { type: 'question', text: question }]);
    setFeedback(null); // Clear previous feedback
    speak(question);
  };

  // Start recording audio
  const startRecording = async () => {
    try {
      // Clear previous transcript before starting new recording
      setCurrentTranscript("");
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Use the transcript from the current recording session
        const responseText = currentTranscript || "Audio response recorded";
        
        // Add to recordings list
        const newRecordings = [...recordings, { 
          id: Date.now(), 
          url: audioUrl, 
          question: currentQuestion,
          timestamp: new Date().toLocaleTimeString(),
          transcript: responseText
        }];
        setRecordings(newRecordings);
        
        // Add to conversation
        setConversation(prev => [...prev, { 
          type: 'answer', 
          text: responseText, 
          audioUrl 
        }]);
        
        // Clean up streams
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log("Recognition already started", e);
        }
      }
    } catch (error) {
      console.error("Error starting recording:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  // Stop recording audio
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.log("Recognition already stopped", e);
        }
      }
    }
  };

  // Play audio
  const playAudio = (url) => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setAudioUrl(null);
    } else {
      audioRef.current.src = url;
      audioRef.current.play();
      setIsPlaying(true);
      setAudioUrl(url);
    }
  };

  // Generate analysis report
  const generateReport = () => {
    if (conversation.length < 2) return;
    
    setIsAnalyzing(true);
    
    // Mock API call to AI service
    // In a real implementation, you would call your AI API here
    setTimeout(() => {
      const lastQuestion = conversation.find(msg => msg.type === 'question')?.text || "";
      const lastAnswer = conversation.find(msg => msg.type === 'answer')?.text || "";
      
      const mockFeedback = {
        clarity: Math.floor(Math.random() * 5) + 1,
        relevance: Math.floor(Math.random() * 5) + 1,
        technicalAccuracy: Math.floor(Math.random() * 5) + 1,
improvements: [
    "Try to provide more specific examples to illustrate your points.",
    "Explore the topic more deeply, consider different perspectives.",
    "Supplement your explanations with practical demonstrations or scenarios."
  ],
  strengths: [
    "Demonstrates quick decision-making skills.",
    "Ability to respond rapidly.",
    "Shows a willingness to engage with the question."
  ]
      };
      
      setFeedback(mockFeedback);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Handle audio ended event
  useEffect(() => {
    const handleAudioEnded = () => {
      setIsPlaying(false);
      setAudioUrl(null);
    };
    
    audioRef.current.addEventListener('ended', handleAudioEnded);
    
    return () => {
      audioRef.current.removeEventListener('ended', handleAudioEnded);
    };
  }, []);

  // Function to render radar chart based on feedback
  const renderRadarChart = () => {
    if (!feedback) return null;
    
    const { clarity, relevance, technicalAccuracy } = feedback;
    const maxRating = 5;
    
    // Calculate positions for a radar/spider chart
    const centerX = 100;
    const centerY = 100;
    const radius = 80;
    
    // Calculate points on the radar
    const points = [
      // Clarity point (top)
      {
        x: centerX,
        y: centerY - (radius * clarity / maxRating),
        label: "Clarity",
        value: clarity
      },
      // Relevance point (bottom right)
      {
        x: centerX + (radius * relevance / maxRating * Math.cos(Math.PI * 2 / 3)),
        y: centerY + (radius * relevance / maxRating * Math.sin(Math.PI * 2 / 3)),
        label: "Relevance",
        value: relevance
      },
      // Technical accuracy point (bottom left)
      {
        x: centerX + (radius * technicalAccuracy / maxRating * Math.cos(Math.PI * 4 / 3)),
        y: centerY + (radius * technicalAccuracy / maxRating * Math.sin(Math.PI * 4 / 3)),
        label: "Technical",
        value: technicalAccuracy
      }
    ];
    
    // Generate polygon points
    const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');
    
    return (
      <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto my-4">
        {/* Background circles */}
        {[1, 2, 3, 4, 5].map((level) => (
          <circle 
            key={level}
            cx={centerX}
            cy={centerY}
            r={radius * level / maxRating}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Axis lines */}
        <line x1={centerX} y1={centerY} x2={centerX} y2={centerY - radius} stroke="#d1d5db" strokeWidth="1" />
        <line 
          x1={centerX} 
          y1={centerY} 
          x2={centerX + radius * Math.cos(Math.PI * 2 / 3)} 
          y2={centerY + radius * Math.sin(Math.PI * 2 / 3)} 
          stroke="#d1d5db" 
          strokeWidth="1" 
        />
        <line 
          x1={centerX} 
          y1={centerY} 
          x2={centerX + radius * Math.cos(Math.PI * 4 / 3)} 
          y2={centerY + radius * Math.sin(Math.PI * 4 / 3)} 
          stroke="#d1d5db" 
          strokeWidth="1" 
        />
        
        {/* Data polygon */}
        <polygon 
          points={polygonPoints} 
          fill="rgba(59, 130, 246, 0.5)" 
          stroke="#3b82f6" 
          strokeWidth="2" 
        />
        
        {/* Data points */}
        {points.map((point, i) => (
          <circle 
            key={i}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#3b82f6"
          />
        ))}
        
        {/* Labels */}
        <text x={centerX} y={centerY - radius - 10} textAnchor="middle" fontSize="12" fill="#4b5563">Clarity</text>
        <text 
          x={centerX + (radius + 15) * Math.cos(Math.PI * 2 / 3)} 
          y={centerY + (radius + 15) * Math.sin(Math.PI * 2 / 3)} 
          textAnchor="middle" 
          fontSize="12" 
          fill="#4b5563"
        >
          Relevance
        </text>
        <text 
          x={centerX + (radius + 15) * Math.cos(Math.PI * 4 / 3)} 
          y={centerY + (radius + 15) * Math.sin(Math.PI * 4 / 3)} 
          textAnchor="middle" 
          fontSize="12" 
          fill="#4b5563"
        >
          Technical
        </text>
        
        {/* Values */}
        {points.map((point, i) => (
          <text 
            key={`value-${i}`}
            x={point.x}
            y={point.y - 10}
            textAnchor="middle"
            fontSize="12"
            fontWeight="bold"
            fill="#3b82f6"
          >
            {point.value}
          </text>
        ))}
      </svg>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {/* Left side - Video */}
      <div className="w-full md:w-1/2">
        <Card className="h-full shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <CardTitle>Interview View</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="relative w-full aspect-video bg-black rounded-md overflow-hidden shadow-inner">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                className="w-full h-full object-cover"
              />
              {isRecording && (
                <div className="absolute top-2 right-2 flex items-center gap-2 bg-black bg-opacity-70 px-3 py-1 rounded-full">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-white text-xs font-medium">REC</span>
                </div>
              )}
            </div>
            <div className="mt-4 text-center text-sm text-gray-500 bg-blue-50 p-3 rounded-md w-full">
              <span className="font-medium">Pro Tip:</span> Maintain good eye contact and posture during your interview.
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Right side - Chat */}
      <div className="w-full md:w-1/2">
        <Card className="h-full shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <CardTitle className="flex items-center justify-between">
              <span>Interactive Learning Avatar</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col h-[calc(100%-7rem)]">
            <ScrollArea className="flex-grow border rounded-md p-4 mb-4 shadow-inner" ref={scrollAreaRef}>
              {conversation.map((item, index) => (
                <div 
                  key={index} 
                  className={`mb-4 p-3 rounded-lg shadow-sm ${
                    item.type === 'question' 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 ml-0 mr-12 border-l-4 border-blue-500' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 ml-12 mr-0 border-l-4 border-gray-400'
                  }`}
                >
                  <div className="mb-1">{item.text}</div>
                  
                  {item.audioUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => playAudio(item.audioUrl)}
                      className="mt-2"
                    >
                      {isPlaying && audioUrl === item.audioUrl ? "Pause" : "Play Recording"}
                    </Button>
                  )}
                </div>
              ))}
              
              {conversation.length === 0 && (
                <div className="text-center text-gray-500 py-16 flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3 text-gray-300">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                  Press "Ask Question" to start the conversation
                </div>
              )}
            </ScrollArea>
            
            {currentQuestion && !feedback && (
              <div className="border-t pt-4 mb-4">
                <div className="font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  Current Question:
                </div>
                <div className="p-4 bg-blue-50 rounded-md border-l-4 border-blue-500">{currentQuestion}</div>
              </div>
            )}
            
            {isRecording && (
              <div className="mt-4 p-4 bg-red-50 rounded-md border border-red-200">
                <div className="font-medium mb-2 flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                  Recording in progress...
                </div>
                {currentTranscript && (
                  <div className="mt-2 italic bg-white p-3 rounded-md shadow-sm">"{currentTranscript}"</div>
                )}
              </div>
            )}
            
            {feedback && (
              <div className="border-t pt-4 mb-4">
                <div className="font-medium mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-500">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Performance Analysis:
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md shadow-sm">
                  {/* Render radar chart */}
                  {renderRadarChart()}
                  
                  <h3 className="font-semibold mb-2 text-blue-700">Strengths:</h3>
                  <ul className="list-disc pl-5 mb-4">
                    {feedback.strengths.map((strength, index) => (
                      <li key={index} className="mb-1">{strength}</li>
                    ))}
                  </ul>
                  
                  <h3 className="font-semibold mb-2 text-blue-700">Areas for Improvement:</h3>
                  <ul className="list-disc pl-5">
                    {feedback.improvements.map((improvement, index) => (
                      <li key={index} className="mb-1">{improvement}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-4 gap-2">
            <Button 
              onClick={askQuestion} 
              disabled={isRecording} 
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M10 9l-6 6 6 6"></path>
                <path d="M10 9v12"></path>
                <path d="M22 9l-9 3 9 3"></path>
              </svg>
              Ask Question
            </Button>
            
            {!isRecording ? (
              <Button 
                onClick={startRecording} 
                variant="outline" 
                className="flex-1 border-red-300 hover:bg-red-50 text-red-600"
                disabled={!currentQuestion}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                Start Recording
              </Button>
            ) : (
              <Button 
                onClick={stopRecording} 
                variant="destructive"
                className="flex-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
                Stop Recording
              </Button>
            )}
            
            <Button
              onClick={generateReport}
              variant="outline"
              className="flex-1 border-blue-300 hover:bg-blue-50 text-blue-600"
              disabled={isRecording || conversation.length < 2 || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  Generate Report
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AvatarQA;