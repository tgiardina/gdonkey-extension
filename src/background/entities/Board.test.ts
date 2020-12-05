import Board from "./Board";
import Wire from "../models/wire";
import { Street } from "../enums";

const wire = <Wire>(<unknown>{
  put: jest.fn(),
});
const board = new Board(wire);

describe("Board", () => {
  beforeEach(() => {
    wire.put = jest.fn();
  });

  it("should sync nothing", async () => {
    await board.sync(10);
    expect(wire.put).toHaveBeenCalledTimes(0);
  });

  it("should have street=Preflop", () => {
    expect(board.street === Street.Preflop);
  });

  it("should sync flop", async () => {
    board.push(
      { rank: 0, suit: 0 },
      { rank: 1, suit: 0 },
      { rank: 2, suit: 0 }
    );
    await board.sync(10);
    expect(wire.put).toHaveBeenCalledTimes(1);
    expect(wire.put).toHaveBeenCalledWith("/games/10/flop", {
      flop: {
        cards: [
          { rank: 0, suit: 0 },
          { rank: 1, suit: 0 },
          { rank: 2, suit: 0 },
        ],
      },
    });
  });

  it("should have street=Flop", () => {
    expect(board.street === Street.Flop);
  });

  it("should sync turn", async () => {
    board.push({ rank: 0, suit: 0 });
    await board.sync(10);
    expect(wire.put).toHaveBeenCalledTimes(2);
    expect(wire.put).toHaveBeenCalledWith("/games/10/flop", {
      flop: {
        cards: [
          { rank: 0, suit: 0 },
          { rank: 1, suit: 0 },
          { rank: 2, suit: 0 },
        ],
      },
    });
    expect(wire.put).toHaveBeenCalledWith("/games/10/turn", {
      turn: {
        cards: [{ rank: 0, suit: 0 }],
      },
    });
  });

  it("should have street=Turn", () => {
    expect(board.street === Street.Turn);
  });

  it("should sync river", async () => {
    board.push({ rank: 0, suit: 0 });
    await board.sync(10);
    expect(wire.put).toHaveBeenCalledTimes(3);
    expect(wire.put).toHaveBeenCalledWith("/games/10/flop", {
      flop: {
        cards: [
          { rank: 0, suit: 0 },
          { rank: 1, suit: 0 },
          { rank: 2, suit: 0 },
        ],
      },
    });
    expect(wire.put).toHaveBeenCalledWith("/games/10/turn", {
      turn: {
        cards: [{ rank: 0, suit: 0 }],
      },
    });
    expect(wire.put).toHaveBeenCalledWith("/games/10/river", {
      river: {
        cards: [{ rank: 0, suit: 0 }],
      },
    });
  });

  it("should have street=River", () => {
    expect(board.street === Street.River);
  });
});
