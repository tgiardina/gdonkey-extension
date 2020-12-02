export enum GameEventId {
  Action = "CO_SELECT_INFO",
  Blind = "CO_BLIND_INFO",
  Button = "CO_DEALER_SEAT",
  FinalStacks = "CO_RESULT_INFO",
  Flop = "CO_BCARD3_INFO",
  GameId = "PLAY_STAGE_INFO",
  GameType = "CO_OPTION_INFO",
  Pocket = "CO_PCARD_INFO",
  Pockets = "CO_CARDTABLE_INFO",
  Sit = "PLAY_SEAT_INFO",
  Stack = "PLAY_ACCOUNT_CASH_RES",
  Start = "CO_TABLE_STATE",
  TurnRiver = "CO_BCARD1_INFO",
}

export interface AbstractGameEvent {
  pid: GameEventId;
}

export interface Action extends AbstractGameEvent {
  bet: number;
  btn: number;
  raise: number;
  seat: number;
}

export interface Blind extends AbstractGameEvent {
  bet: number;
  dead: number;
  seat: number;
}

export interface Button extends AbstractGameEvent {
  seat: number;
}

export interface FinalStacks extends AbstractGameEvent {
  account: number[];
}

export interface Flop extends AbstractGameEvent {
  bcard: number[];
}

export interface GameId extends AbstractGameEvent {
  stageNo: string;
}

export interface GameType extends AbstractGameEvent {
  bblind: number;
  sblind: number;
}

export interface Pocket extends AbstractGameEvent {
  card: [number, number];
  seat: number;
}

export interface Pockets extends AbstractGameEvent, Record<string, unknown> {
  seat1?: [number, number];
  seat2?: [number, number];
  seat3?: [number, number];
  seat4?: [number, number];
  seat5?: [number, number];
  seat6?: [number, number];
  seat7?: [number, number];
  seat8?: [number, number];
  seat9?: [number, number];
}

export interface Sit extends AbstractGameEvent {
  account: number;
  nickName: string;
  seat: number;
  type: number;
}

export interface Stack extends AbstractGameEvent {
  cash: number;
  seat: number;
}

export interface Start extends AbstractGameEvent {
  tableState: number;
}

export interface TurnRiver extends AbstractGameEvent {
  card: number;
}

export type GameEvent =
  | Action
  | Blind
  | Button
  | FinalStacks
  | Flop
  | GameId
  | GameType
  | Pocket
  | Pockets
  | Sit
  | Stack
  | Start
  | TurnRiver;
