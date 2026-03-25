import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getSession } from '@/lib/db-queries';
import { getColumns } from '@/lib/retro-formats';
import { SocketProvider } from '@/components/providers/SocketProvider';
import { RetroBoard } from '@/components/board/RetroBoard';

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  const session = getSession(sessionId);
  if (!session) notFound();

  const columns = getColumns(session.format);
  const authSession = await auth();
  const authDisplayName = authSession?.user?.name ?? undefined;

  const sessionData = {
    id: session.id,
    name: session.name,
    format: session.format,
    phase: session.phase,
    maxVotes: session.max_votes,
    timerEndsAt: session.timer_ends_at,
  };

  return (
    <SocketProvider sessionId={sessionId} authDisplayName={authDisplayName}>
      <RetroBoard
        sessionId={sessionId}
        initialSession={sessionData}
        initialColumns={columns}
      />
    </SocketProvider>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { sessionId } = await params;
  const session = getSession(sessionId);
  return {
    title: session ? `${session.name} — RWM` : 'RWM',
  };
}
