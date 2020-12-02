import Table from "./Table";
import Wire from "../models/wire";
import { InvalidCasinoError, InvalidTableError } from "../errors";

const wire = <Wire>(<unknown>{
  get: jest.fn(() => [
    {
      id: 1,
      bigBlind: 50,
    },
  ]),
});

describe("Table", () => {
  it("should sync", async () => {
    const table = new Table(wire, 50, 25);
    await table.sync(1);
    expect(wire.get).toHaveBeenCalledTimes(1);
    expect(wire.get).toHaveBeenCalledWith("/casinos/1/tables");
    expect(table.id).toEqual(1);
  });

  it("should throw error if can't sync", async () => {
    const table = new Table(wire, 49, 25);
    await expect(table.sync(1)).rejects.toThrow(new InvalidTableError(1, 49));
  });
});
