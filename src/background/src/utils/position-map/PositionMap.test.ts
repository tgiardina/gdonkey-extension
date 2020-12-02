import { InactiveSeatError, InvalidSeatError } from "../../errors";
import SeatChart from "../seat-chart";
import PositionMap from "./";

describe("PositionMap", () => {
  it("should successfully map", () => {
    const isActives: SeatChart<boolean> = new SeatChart();
    isActives.write(3, true);
    isActives.write(6, true);
    const map = new PositionMap(5, isActives);
    expect(map.map(6)).toEqual(0);
    expect(map.map(3)).toEqual(1);
  });

  it("should throw correct errors", () => {
    const map = new PositionMap(0, new SeatChart());
    expect(() => map.map(5)).toThrow(new InactiveSeatError(5));
    expect(() => map.map(10)).toThrow(new InvalidSeatError(10));
  });

  it("should fail to create map with invalid button", () => {
    expect(() => new PositionMap(10, new SeatChart())).toThrow(
      new InvalidSeatError(10)
    );
  });
});
