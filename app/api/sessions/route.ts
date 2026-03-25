import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createSession, getAllSessions } from '@/lib/db-queries';
import { VALID_FORMAT_IDS } from '@/lib/retro-formats';

export async function GET() {
  try {
    const sessions = getAllSessions();
    return NextResponse.json({ sessions });
  } catch (err) {
    console.error('GET /api/sessions error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, format, maxVotes } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Session name is required' }, { status: 400 });
    }
    if (!format || !VALID_FORMAT_IDS.includes(format)) {
      return NextResponse.json(
        { error: `Invalid format. Must be one of: ${VALID_FORMAT_IDS.join(', ')}` },
        { status: 400 }
      );
    }

    const sessionId = uuidv4();
    const facilitatorToken = uuidv4();

    createSession({
      id: sessionId,
      name: name.trim(),
      format,
      facilitatorToken,
      maxVotes: typeof maxVotes === 'number' && maxVotes > 0 ? maxVotes : 3,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareUrl = `${appUrl}/session/${sessionId}`;

    return NextResponse.json({ sessionId, facilitatorToken, shareUrl }, { status: 201 });
  } catch (err) {
    console.error('POST /api/sessions error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
