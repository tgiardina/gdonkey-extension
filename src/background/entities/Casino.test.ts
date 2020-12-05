import Casino from "./Casino";
import Wire from "../models/wire";
import { InvalidCasinoError } from "../errors";

const wire = <Wire>(<unknown>{
  get: jest.fn(() => [
    {
      id: 1,
      name: "gpokr",
    },
  ]),
});

describe("Casino", () => {
  it("should sync", async () => {
    const casino = new Casino(wire, "gpokr");
    await casino.sync();
    expect(wire.get).toHaveBeenCalledTimes(1);
    expect(wire.get).toHaveBeenCalledWith("/casinos");
    expect(casino.id).toEqual(1);
  });

  it("should throw error if can't sync", async () => {
    const casino = new Casino(wire, "gpok");
    await expect(casino.sync()).rejects.toThrow(new InvalidCasinoError("gpok"));
  });
});
