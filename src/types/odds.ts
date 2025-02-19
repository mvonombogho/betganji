export interface Outcome {
  name: string;
  price: number;
}

export interface Market {
  key: string;
  outcomes: Outcome[];
}

export interface Bookmaker {
  key: string;
  title: string;
  lastUpdate: Date;
  markets: Market[];
}

export interface OddsData {
  id: string;
  sportKey: string;
  sportTitle: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: Date;
  bookmakers: Bookmaker[];
}

export interface OddsResponse {
  data: OddsData[];
  success: boolean;
  error?: string;
}