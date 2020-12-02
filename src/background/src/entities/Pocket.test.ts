import Pocket from "./Pocket";
import Wire from "../models/wire";

const wire = <Wire>(<unknown>{
  put: jest.fn(),
});
const pocket = new Pocket(wire, 1, { rank: 0, suit: 0 }, { rank: 1, suit: 0 });

describe("Pocket", () => {
  it("should sync", async () => {
    await pocket.sync(10);
    expect(wire.put).toHaveBeenCalledTimes(1);
    expect(wire.put).toHaveBeenCalledWith("/seats/10/pocket", {
      pocket: {
        cards: [
          { rank: 0, suit: 0 },
          { rank: 1, suit: 0 },
        ],
      },
    });
  });
});
