export type GameResult = 'Won' | 'Lost' | 'Canceled';

export interface Game {
  id: string;
  date: string;
  opponents: string[];
  result: GameResult;
  score: string | null;
  points: number;
  court: string;
  duration: number; // in minutes
  shots: {
    smash: number;
    volley: number;
    bandeja: number;
    lob: number;
  };
}

export const GAME_HISTORY: Game[] = [
  {
    id: '1',
    date: '2024-03-15',
    opponents: ['Carlos', 'Diego'],
    result: 'Won',
    score: '6-4, 3-6, 7-5',
    points: 8,
    court: 'Court 3',
    duration: 120,
    shots: {
      smash: 5,
      volley: 8,
      bandeja: 12,
      lob: 3,
    },
  },
  {
    id: '2',
    date: '2024-03-12',
    opponents: ['Maria', 'Ana'],
    result: 'Lost',
    score: '4-6, 2-6',
    points: 6,
    court: 'Court 1',
    duration: 90,
    shots: {
      smash: 3,
      volley: 6,
      bandeja: 8,
      lob: 2,
    },
  },
  {
    id: '3',
    date: '2024-03-10',
    opponents: ['Juan', 'Pedro'],
    result: 'Won',
    score: '6-3, 6-4',
    points: 9,
    court: 'Court 2',
    duration: 85,
    shots: {
      smash: 6,
      volley: 7,
      bandeja: 10,
      lob: 4,
    },
  },
  {
    id: '4',
    date: '2024-03-08',
    opponents: ['Laura', 'Sofia'],
    result: 'Won',
    score: '6-2, 6-3',
    points: 10,
    court: 'Court 4',
    duration: 75,
    shots: {
      smash: 7,
      volley: 9,
      bandeja: 11,
      lob: 3,
    },
  },
  {
    id: '5',
    date: '2024-03-05',
    opponents: ['Miguel', 'Antonio'],
    result: 'Lost',
    score: '3-6, 4-6',
    points: 5,
    court: 'Court 1',
    duration: 95,
    shots: {
      smash: 4,
      volley: 5,
      bandeja: 7,
      lob: 2,
    },
  },
  {
    id: '6',
    date: '2024-03-01',
    opponents: ['Elena', 'Carmen'],
    result: 'Won',
    score: '6-4, 6-2',
    points: 9,
    court: 'Court 3',
    duration: 80,
    shots: {
      smash: 6,
      volley: 8,
      bandeja: 9,
      lob: 3,
    },
  },
  {
    id: '7',
    date: '2024-02-28',
    opponents: ['David', 'Roberto'],
    result: 'Canceled',
    score: null,
    points: 0,
    court: 'Court 2',
    duration: 0,
    shots: {
      smash: 0,
      volley: 0,
      bandeja: 0,
      lob: 0,
    },
  },
  {
    id: '8',
    date: '2024-02-25',
    opponents: ['Isabel', 'Patricia'],
    result: 'Won',
    score: '6-3, 6-4',
    points: 8,
    court: 'Court 4',
    duration: 85,
    shots: {
      smash: 5,
      volley: 7,
      bandeja: 10,
      lob: 4,
    },
  },
  {
    id: '9',
    date: '2024-02-22',
    opponents: ['Francisco', 'Javier'],
    result: 'Lost',
    score: '2-6, 3-6',
    points: 4,
    court: 'Court 1',
    duration: 70,
    shots: {
      smash: 3,
      volley: 4,
      bandeja: 6,
      lob: 2,
    },
  },
  {
    id: '10',
    date: '2024-02-20',
    opponents: ['Lucia', 'Marta'],
    result: 'Won',
    score: '6-4, 6-3',
    points: 9,
    court: 'Court 3',
    duration: 90,
    shots: {
      smash: 6,
      volley: 8,
      bandeja: 11,
      lob: 3,
    },
  },
  {
    id: '11',
    date: '2024-02-18',
    opponents: ['Alberto', 'Ramon'],
    result: 'Won',
    score: '6-2, 6-4',
    points: 10,
    court: 'Court 2',
    duration: 80,
    shots: {
      smash: 7,
      volley: 9,
      bandeja: 12,
      lob: 4,
    },
  },
  {
    id: '12',
    date: '2024-02-15',
    opponents: ['Beatriz', 'Nuria'],
    result: 'Lost',
    score: '4-6, 3-6',
    points: 6,
    court: 'Court 4',
    duration: 95,
    shots: {
      smash: 4,
      volley: 6,
      bandeja: 8,
      lob: 3,
    },
  },
  {
    id: '13',
    date: '2024-02-12',
    opponents: ['Victor', 'Manuel'],
    result: 'Won',
    score: '6-3, 6-4',
    points: 8,
    court: 'Court 1',
    duration: 85,
    shots: {
      smash: 5,
      volley: 7,
      bandeja: 9,
      lob: 3,
    },
  },
  {
    id: '14',
    date: '2024-02-10',
    opponents: ['Rosa', 'Teresa'],
    result: 'Won',
    score: '6-4, 6-2',
    points: 9,
    court: 'Court 3',
    duration: 90,
    shots: {
      smash: 6,
      volley: 8,
      bandeja: 10,
      lob: 4,
    },
  },
  {
    id: '15',
    date: '2024-02-08',
    opponents: ['Jose', 'Fernando'],
    result: 'Lost',
    score: '3-6, 4-6',
    points: 5,
    court: 'Court 2',
    duration: 95,
    shots: {
      smash: 4,
      volley: 5,
      bandeja: 7,
      lob: 2,
    },
  },
];

export const calculateStats = (games: Game[]) => {
  const completedGames = games.filter(game => game.result !== 'Canceled');
  const wonGames = games.filter(game => game.result === 'Won');

  const totalPoints = completedGames.reduce(
    (sum, game) => sum + game.points,
    0,
  );

  const shotCounts = completedGames.reduce(
    (acc, game) => {
      acc.smash += game.shots.smash;
      acc.volley += game.shots.volley;
      acc.bandeja += game.shots.bandeja;
      acc.lob += game.shots.lob;
      return acc;
    },
    {smash: 0, volley: 0, bandeja: 0, lob: 0},
  );

  const favoriteShot = Object.entries(shotCounts).reduce((a, b) =>
    a[1] > b[1] ? a : b,
  )[0];

  return {
    matchesPlayed: completedGames.length,
    winRate: `${Math.round((wonGames.length / completedGames.length) * 100)}%`,
    averagePoints: (totalPoints / completedGames.length).toFixed(1),
    bestStreak: calculateBestStreak(games),
    totalGames: games.length,
    favoriteShot: favoriteShot.charAt(0).toUpperCase() + favoriteShot.slice(1),
  };
};

const calculateBestStreak = (games: Game[]) => {
  let currentStreak = 0;
  let bestStreak = 0;

  games.forEach(game => {
    if (game.result === 'Won') {
      currentStreak++;
      bestStreak = Math.max(bestStreak, currentStreak);
    } else if (game.result === 'Lost') {
      currentStreak = 0;
    }
  });

  return bestStreak;
};
