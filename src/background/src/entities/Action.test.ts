import Action from "./Action";
import { AlreadyPublishedError } from "../errors";
import { ActionType, BlindType, Street } from "../enums";
import Wire from "../models/wire";

const wire = <Wire>(<unknown>{
  post: jest.fn((url: string) => {
    if (url === "/actions") return { id: 1 };
  }),
});
const action = new Action(
  wire,
  1,
  Street.Flop,
  ActionType.BetRaise,
  1500,
  0,
  100
);

describe("Action", () => {
  it("should publish", async () => {
    await action.publish(10);
    expect(wire.post).toHaveBeenCalledTimes(1);
    expect(wire.post).toHaveBeenCalledWith("/actions", {
      action: {
        street: Street.Flop,
        type: ActionType.BetRaise,
        amount: 1500,
        tally: 0,
        delay: 100,
        seatId: 10,
      },
    });
    expect(action.id).toEqual(1);
  });

  it("should throw error if published twice", async () => {
    await expect(() => action.publish(10)).rejects.toThrow(
      new AlreadyPublishedError("action", 1)
    );
  });
});
