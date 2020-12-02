import ActionType from "../../../interfaces/ActionType";
import BlindType from "../../../interfaces/BlindType";
import { GameEventId } from "./game-event";
import { Translator } from "./";
import Curator from "../../../entities/curator";

const curator = ({
  activateSeat: jest.fn(),
  billMissedBlind: jest.fn(),
  concatBoard: jest.fn(),
  endGame: jest.fn(),
  init: jest.fn(),
  markAsUser: jest.fn(),
  pushAction: jest.fn(),
  pushBlind: jest.fn(),
  setBlind: jest.fn(),
  setButton: jest.fn(),
  setGameId: jest.fn(),
  setPlayer: jest.fn(),
  setPocket: jest.fn(),
  setStack: jest.fn(),
  startNewGame: jest.fn(),
} as unknown) as Curator;
const translator = new Translator(curator);

describe("translate function", () => {
  beforeEach(jest.clearAllMocks);

  it("should handle unrelated event", () => {
    translator.translate({ pid: <GameEventId>"unrelated" });
  });

  it("should translate Fold Action correctly", () => {
    const action = { seat: 9, btn: 1024, bet: 0, raise: 0 };
    translator.translate({
      pid: GameEventId.Action,
      ...action,
    });
    expect(curator.pushAction).toBeCalledTimes(1);
    expect(curator.pushAction).toBeCalledWith(8, ActionType.Fold);
  });

  it("should translate Check Action correctly", () => {
    const action = { seat: 1, btn: 64, bet: 0, raise: 0 };
    translator.translate({
      pid: GameEventId.Action,
      ...action,
    });
    expect(curator.pushAction).toBeCalledTimes(1);
    expect(curator.pushAction).toBeCalledWith(0, ActionType.CheckCall);
  });

  it("should translate Call Action correctly", () => {
    const action = { seat: 2, btn: 256, bet: 5, raise: 0 };
    translator.translate({
      pid: GameEventId.Action,
      ...action,
    });
    expect(curator.pushAction).toBeCalledTimes(1);
    expect(curator.pushAction).toBeCalledWith(1, ActionType.CheckCall);
  });

  it("should translate Bet Action correctly", () => {
    const action = { seat: 2, btn: 128, bet: 5, raise: 0 };
    translator.translate({
      pid: GameEventId.Action,
      ...action,
    });
    expect(curator.pushAction).toBeCalledTimes(1);
    expect(curator.pushAction).toBeCalledWith(1, ActionType.BetRaise, 5);
  });

  it("should translate Raise Action correctly", () => {
    const action = { seat: 8, btn: 512, bet: 5, raise: 20 };
    translator.translate({
      pid: GameEventId.Action,
      ...action,
    });
    expect(curator.pushAction).toBeCalledTimes(1);
    expect(curator.pushAction).toBeCalledWith(7, ActionType.BetRaise, 20);
  });

  it("should translate Blind correctly", () => {
    const blind = { seat: 7, bet: 2, dead: 0 };
    translator.translate({
      pid: GameEventId.Blind,
      ...blind,
    });
    expect(curator.pushBlind).toBeCalledTimes(1);
    expect(curator.pushBlind).toBeCalledWith(6, ActionType.PostBlind, 2);
  });

  it("should translate Blind Missed correctly", () => {
    const blind = { seat: 8, bet: 5, dead: 2 };
    translator.translate({
      pid: GameEventId.Blind,
      ...blind,
    });
    expect(curator.pushBlind).toBeCalledTimes(2);
    expect(curator.pushBlind).toBeCalledWith(7, ActionType.PostBlind, 5);
    expect(curator.pushBlind).toBeCalledWith(7, ActionType.Donate, 2);
  });

  it("should translate Button correctly", () => {
    const action = { seat: 8 };
    translator.translate({
      pid: GameEventId.Button,
      ...action,
    });
    expect(curator.setButton).toBeCalledTimes(1);
    expect(curator.setButton).toBeCalledWith(7);
  });

  it("should translate Final Stacks correctly", () => {
    const stacks = { account: [150, 250, 531, 0, 0, 0, 0, 0, 490] };
    translator.translate({
      pid: GameEventId.FinalStacks,
      ...stacks,
    });
    expect(curator.setStack).toBeCalledTimes(4);
    expect(curator.setStack).toBeCalledWith(0, 150);
    expect(curator.setStack).toBeCalledWith(1, 250);
    expect(curator.setStack).toBeCalledWith(2, 531);
    expect(curator.setStack).toBeCalledWith(8, 490);
    expect(curator.endGame).toBeCalledTimes(1);
  });

  it("should translate Flop correctly", () => {
    const board = { bcard: [0, 1, 2] };
    translator.translate({
      pid: GameEventId.Flop,
      ...board,
    });
    expect(curator.concatBoard).toBeCalledTimes(1);
    expect(curator.concatBoard).toBeCalledWith(
      { rank: 12, suit: 0 },
      { rank: 0, suit: 0 },
      { rank: 1, suit: 0 }
    );
  });

  it("should translate GameId correctly", () => {
    const info = { stageNo: "hi" };
    translator.translate({
      pid: GameEventId.GameId,
      ...info,
    });
    expect(curator.setGameId).toBeCalledTimes(1);
    expect(curator.setGameId).toBeCalledWith("hi");
  });

  it("should translate GameType correctly", () => {
    const info = { bblind: 5, sblind: 2 };
    translator.translate({
      pid: GameEventId.GameType,
      ...info,
    });
    expect(curator.setBlind).toBeCalledTimes(2);
    expect(curator.setBlind).toBeCalledWith(BlindType.Big, 5);
    expect(curator.setBlind).toBeCalledWith(BlindType.Small, 2);
    expect(curator.init).toBeCalledTimes(1);
  });

  it("should translate Pocket correctly", () => {
    const pocket = { seat: 4, card: [25, 13] };
    translator.translate({
      pid: GameEventId.Pocket,
      ...pocket,
    });
    expect(curator.setPocket).toBeCalledTimes(1);
    expect(curator.setPocket).toBeCalledWith(
      3,
      { rank: 11, suit: 1 },
      { rank: 12, suit: 1 }
    );
  });

  it("should translate Pockets correctly", () => {
    const pocket = {
      seat1: <[number, number]>[32896, 32896],
      seat4: <[number, number]>[22, 25],
      seat6: <[number, number]>[32896, 32896],
    };
    translator.translate({
      pid: GameEventId.Pockets,
      ...pocket,
    });
    expect(curator.activateSeat).toBeCalledTimes(3);
    expect(curator.activateSeat).toBeCalledWith(0);
    expect(curator.activateSeat).toBeCalledWith(3);
    expect(curator.activateSeat).toBeCalledWith(5);
    expect(curator.setPocket).toBeCalledTimes(1);
    expect(curator.setPocket).toBeCalledWith(
      3,
      { rank: 8, suit: 1 },
      { rank: 11, suit: 1 }
    );
  });

  it("should translate anonymous Sit correctly", () => {
    const player = { type: 1, seat: 7, account: 500, nickName: "" };
    translator.translate({
      pid: GameEventId.Sit,
      ...player,
    });
    expect(curator.setPlayer).toBeCalledTimes(1);
    expect(curator.setPlayer).toBeCalledWith(6);
    expect(curator.setStack).toBeCalledTimes(1);
    expect(curator.setStack).toBeCalledWith(6, 500);
    expect(curator.markAsUser).toBeCalledTimes(0);
  });

  it("should translate user Sit correctly", () => {
    const player = { type: 1, seat: 7, account: 500, nickName: "abcd" };
    translator.translate({
      pid: GameEventId.Sit,
      ...player,
    });
    expect(curator.setPlayer).toBeCalledTimes(1);
    expect(curator.setPlayer).toBeCalledWith(6);
    expect(curator.setStack).toBeCalledTimes(1);
    expect(curator.setStack).toBeCalledWith(6, 500);
    expect(curator.markAsUser).toBeCalledTimes(1);
    expect(curator.markAsUser).toBeCalledWith(6);
  });

  it("should translate non-sit Sit correctly", () => {
    const player = { type: 0, seat: 7, account: 500 };
    translator.translate({
      pid: GameEventId.Sit,
      ...player,
    });
    expect(curator.setPlayer).toBeCalledTimes(0);
    expect(curator.setStack).toBeCalledTimes(0);
  });

  it("should translate Stack correctly", () => {
    const stack = { seat: 7, cash: 500 };
    translator.translate({
      pid: GameEventId.Stack,
      ...stack,
    });
    expect(curator.setStack).toBeCalledTimes(1);
    expect(curator.setStack).toBeCalledWith(6, 500);
  });

  it("should translate Start correctly", () => {
    const start = { tableState: 2 };
    translator.translate({
      pid: GameEventId.Start,
      ...start,
    });
    expect(curator.startNewGame).toBeCalledTimes(1);
  });

  it("should translate Start False correctly", () => {
    const start = { tableState: 4 };
    translator.translate({
      pid: GameEventId.Start,
      ...start,
    });
    expect(curator.startNewGame).toBeCalledTimes(0);
  });

  it("should translate TurnRiver correctly", () => {
    const board = { card: 17 };
    translator.translate({
      pid: GameEventId.TurnRiver,
      ...board,
    });
    expect(curator.concatBoard).toBeCalledTimes(1);
    expect(curator.concatBoard).toBeCalledWith({ rank: 3, suit: 1 });
  });
});
