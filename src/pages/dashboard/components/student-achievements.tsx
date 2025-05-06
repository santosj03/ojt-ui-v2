import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Achievement {
  id: number;
  name: string;
  score: number;
  accomplished: string;
}
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function StudentAchievments() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${apiBaseUrl}/student/achievement/list`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setAchievements(response.data.data);
      } catch (error) {
        console.error('API error:', error);
      }
    };

    fetchAchievements();
  }, []);

  return (
    <div className="space-y-8 overflow-auto">
      {achievements.length === 0 ? (
        <p className="text-sm text-muted-foreground">No achievements found.</p>
      ) : (
        achievements.map((item, index) => (
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/avatars/01.png" alt="Avatar" />
              <AvatarFallback>
                {item.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{item.name}</p>
              <p className="text-sm text-muted-foreground">
                {item.accomplished}
              </p>
            </div>
            <div className="ml-auto font-medium">{item.score}</div>
          </div>
        ))
      )}
    </div>
  );
}
