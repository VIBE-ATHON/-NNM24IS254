import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Star, TrendingUp, Award } from 'lucide-react';
import { UserStats } from '@/lib/types';

interface RecoveryScoreboardProps {
  userStats: UserStats;
  topUsers?: UserStats[];
}

export function RecoveryScoreboard({ userStats, topUsers = [] }: RecoveryScoreboardProps) {
  const getLevelBadge = (score: number) => {
    if (score >= 100) return { level: 'Hero', color: 'bg-gradient-to-r from-yellow-400 to-orange-500', icon: '🏆' };
    if (score >= 50) return { level: 'Expert', color: 'bg-gradient-to-r from-blue-500 to-purple-500', icon: '⭐' };
    if (score >= 20) return { level: 'Helper', color: 'bg-gradient-to-r from-green-500 to-blue-500', icon: '🌟' };
    if (score >= 5) return { level: 'Finder', color: 'bg-gradient-to-r from-gray-500 to-gray-600', icon: '🔍' };
    return { level: 'Newbie', color: 'bg-gradient-to-r from-gray-400 to-gray-500', icon: '🆕' };
  };

  const userLevel = getLevelBadge(userStats.recoveryScore);

  return (
    <div className="space-y-4">
      {/* User Stats Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Recovery Stats
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Level Badge */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold ${userLevel.color}`}>
              <span className="text-lg">{userLevel.icon}</span>
              <span>{userLevel.level}</span>
            </div>
            <p className="text-2xl font-bold mt-2">{userStats.recoveryScore} pts</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-lg font-semibold text-primary">{userStats.itemsPosted}</div>
              <div className="text-xs text-muted-foreground">Items Posted</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-green-600">{userStats.itemsReturned}</div>
              <div className="text-xs text-muted-foreground">Items Returned</div>
            </div>
            <div className="space-y-1">
              <div className="text-lg font-semibold text-blue-600">{userStats.itemsFound}</div>
              <div className="text-xs text-muted-foreground">Items Found</div>
            </div>
          </div>

          {/* Progress to Next Level */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {getLevelBadge(userStats.recoveryScore + 20).level}</span>
              <span>{userStats.recoveryScore % 20}/20</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((userStats.recoveryScore % 20) / 20) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      {topUsers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Helpers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topUsers.slice(0, 5).map((user, index) => {
              const level = getLevelBadge(user.recoveryScore);
              return (
                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {index === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                      {index === 1 && <Award className="h-4 w-4 text-gray-400" />}
                      {index === 2 && <Star className="h-4 w-4 text-orange-500" />}
                      {index > 2 && <span className="text-sm text-muted-foreground">#{index + 1}</span>}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {level.icon}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">User {user.id.slice(-4)}</div>
                      <div className="text-xs text-muted-foreground">{level.level}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">{user.recoveryScore} pts</Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}