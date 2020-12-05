import Game from "./Game";
import Wire from "../models/wire";

let wire: Wire;

describe("Game", () => {
  beforeEach(() => {
    wire = <Wire>(<unknown>{
      post: jest.fn((url: string) => {
        if (url === "/games") return { id: 1 };
      }),
      patch: jest.fn(),
    });
  });

  it("should sync all at once", async () => {
    const game = new Game(wire, "abc");
    game.end();
    await game.sync(2);
    expect(wire.post).toHaveBeenCalledTimes(1);
    expect(wire.post).toHaveBeenCalledWith("/games", {
      game: {
        externalId: "abc",
        startedAt: expect.anything(),
        endedAt: expect.anything(),
        tableId: 2,
      },
    });
    expect(game.id).toEqual(1);
  });

  it("should sync in two parts", async () => {
    const game = new Game(wire, "abc");
    await game.sync(2);
    game.end();
    await game.sync(2);
    expect(wire.post).toHaveBeenCalledTimes(1);
    expect(wire.post).toHaveBeenCalledWith("/games", {
      game: {
        externalId: "abc",
        startedAt: expect.anything(),
        tableId: 2,
      },
    });
    expect(game.id).toEqual(1);
    expect(wire.patch).toHaveBeenCalledTimes(1);
    expect(wire.patch).toHaveBeenCalledWith("/games/1", {
      game: { endedAt: expect.anything() },
    });
  });
});
