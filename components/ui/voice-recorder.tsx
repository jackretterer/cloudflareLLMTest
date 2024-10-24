"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface AudioRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
  onStartRecording: () => void;
}

export function AudioRecorder({ onTranscriptionComplete, onStartRecording }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function startRecording() {
    onStartRecording();
    setIsProcessing(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  }

  async function stopRecording() {
    if (!mediaRecorderRef.current) return;

    setIsProcessing(true);
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      try {
        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: arrayBuffer,
        });
        const data = await response.json() as { text: string };
        onTranscriptionComplete(data.text);
      } catch (error) {
        console.error("Transcription error:", error);
      } finally {
        setIsProcessing(false);
        setIsRecording(false);
      }
    };
  }
  return (
    <Card className="p-6 w-full max-w-md">
      <div className="space-y-4">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-full ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-indigo-500 hover:bg-indigo-600'
          }`}
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            isRecording ? "Stop Recording" : "Start Recording"
          )}
        </Button>
      </div>
    </Card>
  );
}
