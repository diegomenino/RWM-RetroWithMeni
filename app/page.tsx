import { CreateSessionForm } from '@/components/session/CreateSessionForm';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">RetroBoard</h1>
          <p className="text-gray-500">Real-time collaborative retrospectives</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create a New Session</h2>
          <CreateSessionForm />
        </div>

        <p className="text-center text-sm text-gray-400 mt-4">
          Have a session link? Just open it to join automatically.
        </p>
      </div>
    </main>
  );
}
