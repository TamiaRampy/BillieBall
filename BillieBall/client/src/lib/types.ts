export interface GameState {
  phase: 'setup' | 'tour-selection' | 'predictions' | 'live' | 'completed';
  players: {
    player1: { id?: string; name: string };
    player2: { id?: string; name: string };
  };
  selectedShow?: {
    id: string;
    venue: string;
    city: string;
    country: string;
    date: string;
  };
  gameId?: string;
  predictions?: Record<string, string>;
}

export interface PredictionAnswers {
  cap: string;
  shirtName: string;
  shirtColor: string;
  songAfterSkinny: string;
  lamourFirstPart: string;
  surpriseGuest: string;
  changeSetlist: string;
}
