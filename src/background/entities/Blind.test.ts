import Blind from "./Blind";
import { AlreadyPublishedError } from "../errors";
import { BlindType, Street } from "../enums";
import Wire from "../models/wire";

const wire = <Wire>(<unknown>{
  post: jest.fn((url: string) => {
    if (url === "/actions") return { id: 1 };
  }),
});
const blind = new Blind(wire, 1, BlindType.PostBlind, 50);

describe("Blind", () => {
  it("should publish", async () => {
    await blind.publish(10);
    expect(wire.post).toHaveBeenCalledTimes(1);
    expect(wire.post).toHaveBeenCalledWith("/actions", {
      action: {
        type: BlindType.PostBlind,
        amount: 50,
        street: Street.Preflop,
        seatId: 10,
      },
    });
    expect(blind.id).toEqual(1);
  });

  it("should throw error if published twice", async () => {
    await expect(() => blind.publish(10)).rejects.toThrow(
      new AlreadyPublishedError("action", 1)
    );
  });
});
