import { NextResponse } from "next/server";

export const runtime = 'edge';

interface Env {
  AI: any;
}

export async function POST(request: Request) {
  try {
    const arrayBuffer = await request.arrayBuffer();
    const inputs = {
      audio: Array.from(new Uint8Array(arrayBuffer))
    };
    
    // Access AI directly through Cloudflare's bindings
    // @ts-ignore - Cloudflare bindings are available at runtime
    const response = await process.env.AI.run('@cf/openai/whisper', inputs);

    console.log("Response", response);
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
  }
}
