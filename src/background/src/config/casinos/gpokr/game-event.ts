export enum GameEventId {
  BetRaise = "BetRaiseEvent",
  CheckCall = "CheckCallEvent",
  End = "TakesPotEvent",
  Flop = "FlopEvent",
  Fold = "FoldEvent",
  Init = "TableUpdateEvent",
  Pocket = "PocketCardsEvent",
  River = "RiverEvent",
  Showdown = "ShowCardsEvent",
  Sit = "SitDownEvent",
  Start = "StartHandEvent",
  Turn = "TurnEvent",
}

export interface AbstractGameEvent {
  typeName: GameEventId;
}

export interface BetRaise extends AbstractGameEvent {
  amount: number;
  seat: number;
}

export interface CheckCall extends AbstractGameEvent {
  seat: number;
}

export interface Flop extends AbstractGameEvent {
  card1: {
    suit: number;
    rank: number;
  };
  card2: {
    suit: number;
    rank: number;
  };
  card3: {
    suit: number;
    rank: number;
  };
}

export interface Fold extends AbstractGameEvent {
  seat: number;
}

export interface Init extends AbstractGameEvent {
  table: {
    gameInfo: {
      playerInfo: ({
        forceBlind: boolean;
        user: {
          name: string;
        };
      } | null)[];
    };
  };
}

export interface Pocket extends AbstractGameEvent {
  card1: {
    suit: number;
    rank: number;
  };
  card2: {
    suit: number;
    rank: number;
  };
  seat: number;
}

export interface River extends AbstractGameEvent {
  card1: {
    suit: number;
    rank: number;
  };
}

export interface Showdown extends AbstractGameEvent {
  card1: {
    suit: number;
    rank: number;
  };
  card2: {
    suit: number;
    rank: number;
  };
  seat: number;
}

export interface Sit extends AbstractGameEvent {
  player: {
    seat: number;
    user: {
      name: string;
    };
  };
}

export interface Start extends AbstractGameEvent {
  bigblind: number;
  chips: number[];
  dealer: number;
  gameId: number;
  smallblind: number;
}

export interface Turn extends AbstractGameEvent {
  card1: {
    suit: number;
    rank: number;
  };
}

export type GameEvent =
  | BetRaise
  | CheckCall
  | Flop
  | Fold
  | Init
  | Pocket
  | River
  | Showdown
  | Sit
  | Start
  | Turn;
