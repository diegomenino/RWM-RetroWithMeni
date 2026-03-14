import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSession } from '@/lib/db-queries';
import { getColumns } from '@/lib/retro-formats';
import { SocketProvider } from '@/components/providers/SocketProvider';
import { RetroBoard } from '@/components/board/RetroBoard';

interface PageProps {
  params: { sessionId: string };
}

export default async function SessionPage({ params }: PageProps) {
  const session = getSession(params.sessionId);
  if (!session) notFound();

  const columns = getColumns(session.format);
  const authSession = await getServerSession(authOptions);
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
    <SocketProvider sessionId={params.sessionId} authDisplayName={authDisplayName}>
      <RetroBoard
        sessionId={params.sessionId}
        initialSession={sessionData}
        initialColumns={columns}
      />
    </SocketProvider>
  );
}

export function generateMetadata({ params }: PageProps) {
  const session = getSession(params.sessionId);
  return {
    title: session ? `${session.name} — RWM` : 'RWM',
  };
}
