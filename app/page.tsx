"use client";

import { useState } from "react";
import { AudioRecorder } from "@/components/ui/voice-recorder";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [transcription, setTranscription] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);

  const handleTranscriptionComplete = async (newTranscription: string) => {
    setTranscription(newTranscription);
    setIsLoadingResponse(true);
    
    try {
      const response = await fetch('/api/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcription: newTranscription }),
      });
      const data = await response.json() as { response: string };
      setAiResponse(data.response);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setAiResponse("Sorry, there was an error processing your request. Please try again.");
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleStartRecording = () => {
    setTranscription("");
    setAiResponse("");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-gray-700 text-center">
          Talk To an LLM
        </h1>
        <p className="text-gray-600 text-center">
          Say anything and get an LLM response back
        </p>
        
        <AudioRecorder 
          onTranscriptionComplete={handleTranscriptionComplete} 
          onStartRecording={handleStartRecording}
        />
        
        {transcription && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="font-semibold mb-2 text-gray-700">Transcription: </h2>
            <p className="text-gray-700">{transcription}</p>
          </div>
        )}

        {(aiResponse || isLoadingResponse) && (
          <div className="p-4 bg-white rounded-lg shadow border-l-4 border-indigo-500">
            <h2 className="font-semibold mb-2 text-gray-700">AI Response: </h2>
            {isLoadingResponse ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            ) : (
              <p className="text-gray-700">{aiResponse}</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
