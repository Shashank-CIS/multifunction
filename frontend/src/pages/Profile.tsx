import { User } from '../types';

interface ProfileProps {
  user: User;
}

export default function Profile({ user }: ProfileProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profile - {user.name}</h1>
      <p>Profile implementation coming soon...</p>
    </div>
  );
} 