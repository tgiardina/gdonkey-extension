import Seat from "./Seat";
import { AlreadyPublishedError } from "../errors";
import Wire from "../models/wire";

const wire = <Wire>(<unknown>{
  post: jest.fn((url: string) => {
    if (url === "/seats") return { id: 1 };
  }),
});
const seat = new Seat(wire, 0, 1500);

describe("Seat", () => {
  it("should publish", async () => {
    await seat.publish(10, 11);
    expect(wire.post).toHaveBeenCalledTimes(1);
    expect(wire.post).toHaveBeenCalledWith("/seats", {
      seat: {
        position: 0,
        stack: 1500,
        gameId: 10,
        playerId: 11,
      },
    });
    expect(seat.id).toEqual(1);
  });

  it("should throw error if published twice", async () => {
    await expect(() => seat.publish(10, 11)).rejects.toThrow(
      new AlreadyPublishedError("seat", 1)
    );
  });
});
