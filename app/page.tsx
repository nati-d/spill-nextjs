'use client';
import { loginUser } from '@/api/auth';
import { useEffect, useState } from 'react'

const Home = () => {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await loginUser();
        setResponse(data);
        setUser(data.user);
      } catch (err) {
        console.error('Login error:', err);
        setError(err instanceof Error ? err.message : 'Failed to login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Home</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Home</h1>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Home</h1>
      
      {user && (
        <div className="mb-6 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <p><span className="font-medium">ID:</span> {user.id}</p>
            <p><span className="font-medium">Telegram ID:</span> {user.telegram_id}</p>
            <p><span className="font-medium">Telegram Username:</span> @{user.telegram_username}</p>
            <p><span className="font-medium">Nickname:</span> {user.nickname || <span className="text-gray-400 italic">Not set</span>}</p>
            <p><span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleString()}</p>
            <p><span className="font-medium">Updated:</span> {new Date(user.updated_at).toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-900 p-4 rounded-lg overflow-auto">
        <h2 className="text-lg font-semibold mb-2 text-gray-300">Full Response:</h2>
        <pre className="text-sm text-gray-300 whitespace-pre-wrap">
          {JSON.stringify(response, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Home;