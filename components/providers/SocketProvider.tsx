'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  participantId: string;
  isFacilitator: boolean;
  facilitatorToken: string | null;
  displayName: string;
  setDisplayName: (name: string) => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  participantId: '',
  isFacilitator: false,
  facilitatorToken: null,
  displayName: '',
  setDisplayName: () => {},
});

function getOrCreate(key: string, factory: () => string): string {
  if (typeof window === 'undefined') return '';
  const existing = localStorage.getItem(key);
  if (existing) return existing;
  const value = factory();
  localStorage.setItem(key, value);
  return value;
}

function generateId(): string {
  return crypto.randomUUID();
}

interface SocketProviderProps {
  sessionId: string;
  children: React.ReactNode;
}

export function SocketProvider({ sessionId, children }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [displayName, setDisplayNameState] = useState('');
  const participantIdRef = useRef('');
  const facilitatorTokenRef = useRef<string | null>(null);
  const isFacilitatorRef = useRef(false);

  useEffect(() => {
    const pid = getOrCreate(`participant_id_${sessionId}`, generateId);
    participantIdRef.current = pid;

    const token = localStorage.getItem(`facilitator_${sessionId}`) || null;
    facilitatorTokenRef.current = token;
    isFacilitatorRef.current = !!token;

    const storedName = localStorage.getItem(`display_name_${sessionId}`);
    const initialName = storedName || '';
    setDisplayNameState(initialName);

    const s = io({ path: '/socket.io', transports: ['websocket'] });

    s.on('connect', () => {
      setIsConnected(true);
      s.emit('join_session', {
        sessionId,
        participantId: pid,
        displayName: localStorage.getItem(`display_name_${sessionId}`) || undefined,
        facilitatorToken: token || undefined,
      });
    });

    s.on('disconnect', () => setIsConnected(false));

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [sessionId]);

  const setDisplayName = (name: string) => {
    setDisplayNameState(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`display_name_${sessionId}`, name);
    }
    if (socket?.connected) {
      socket.emit('rename_participant', { sessionId, displayName: name });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        participantId: participantIdRef.current,
        isFacilitator: isFacilitatorRef.current,
        facilitatorToken: facilitatorTokenRef.current,
        displayName,
        setDisplayName,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
