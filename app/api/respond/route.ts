import { NextResponse } from "next/server";

export const runtime = 'edge';

interface Env {
  AI: any;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { transcription: string };
    const { transcription } = body;
    
    let chat = {
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: transcription }
      ]
    };
    
    // @ts-ignore - Cloudflare bindings are available at runtime
    const response = await process.env.AI.run('@cf/meta/llama-3-8b-instruct', chat);

    console.log("Response", response);
    
    // Simply return the response as is - it's already in the correct format
    return NextResponse.json({ response: response.response });
  } catch (error) {
    console.error('AI response error:', error);
    return NextResponse.json({ error: "AI response failed" }, { status: 500 });
  }
}
