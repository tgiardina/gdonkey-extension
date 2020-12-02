import Player from "./Player";
import Wire from "../models/wire";

let wire: Wire;

describe("Player", () => {
  beforeEach(() => {
    wire = <Wire>(<unknown>{
      post: jest.fn((url: string) => {
        if (url === "/players") return { id: 1 };
      }),
      get: jest.fn((url: string) => {
        if (url === "/casinos/1/players?username=user") {
          return [{ id: 1 }];
        } else {
          return [];
        }
      }),
    });
  });

  it("should sync pre-existing player who is user", async () => {
    const player = new Player(wire, 0, "user", true);
    await player.sync(1);
    await player.sync(2); // should be ignored.
    expect(wire.get).toHaveBeenCalledTimes(1);
    expect(wire.get).toHaveBeenCalledWith("/casinos/1/players?username=user");
    expect(player.id).toEqual(1);
  });

  it("should sync new player who is not user", async () => {
    const player = new Player(wire, 0, "user");
    await player.sync(2);
    await player.sync(1); // should be ignored.
    expect(wire.get).toHaveBeenCalledTimes(1);
    expect(wire.get).toHaveBeenCalledWith("/casinos/2/players?username=user");
    expect(wire.post).toHaveBeenCalledTimes(1);
    expect(wire.post).toHaveBeenCalledWith("/players", {
      player: {
        isMe: false,
        username: "user",
        casinoId: 2,
      },
    });
    expect(player.id).toEqual(1);
  });
});
