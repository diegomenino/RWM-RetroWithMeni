'use client';

interface Participant {
  participantId: string;
  displayName: string;
  isFacilitator: boolean;
  joinedAt: number;
}

interface ParticipantListProps {
  participants: Participant[];
}

export function ParticipantList({ participants }: ParticipantListProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {participants.map(p => (
        <span
          key={p.participantId}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
            p.isFacilitator
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
          {p.displayName}
          {p.isFacilitator && <span className="text-indigo-500">★</span>}
        </span>
      ))}
    </div>
  );
}
