import SeatChart from "./";
import InvalidSeatError from "../../errors/InvalidSeatError";

const chart = new SeatChart<number>();

describe("SeatChart", () => {
  it("should return length 0 after init", () => {
    expect(chart.length).toEqual(0);
  });

  it("should write without error", () => {
    chart.write(0, 0);
    chart.write(1, 1);
  });

  it("should return correct length after additions", () => {
    expect(chart.length).toEqual(2);
  });

  it("should read correct values after additions", () => {
    expect(chart.read(0)).toEqual(0);
    expect(chart.read(1)).toEqual(1);
  });

  it("should read only defined values when calling forEach", () => {
    const items: number[] = [];
    chart.forEach((item, index) => {
      items.push(item, index);
    });
    expect(items).toEqual([0, 0, 1, 1]);
  });

  it("should map only defined values when calling map", () => {
    const items = chart.map((item, index) => {
      return [item, index];
    });
    expect(items).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it("should reduce only defined values when calling reduce", () => {
    const items = chart.reduce((acc, item, index) => {
      acc.push([item, index]);
      return acc;
    }, <number[][]>[]);
    expect(items).toEqual([
      [0, 0],
      [1, 1],
    ]);
  });

  it("should erase without error", () => {
    chart.erase(0);
    chart.erase(3);
  });

  it("should return correct length after erasure", () => {
    expect(chart.length).toEqual(1);
  });

  it("should read correct values after erasure", () => {
    expect(chart.read(0)).toEqual(undefined);
    expect(chart.read(1)).toEqual(1);
  });

  it("should throw error when invalid seat is provided", () => {
    expect(() => chart.write(9, 9)).toThrow(new InvalidSeatError(9));
    expect(() => chart.read(-1)).toThrow(new InvalidSeatError(-1));
    expect(() => chart.erase(10)).toThrow(new InvalidSeatError(10));
  });
});
