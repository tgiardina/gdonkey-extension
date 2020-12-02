import * as _ from "lodash";
import InvalidSeatError from "../../errors/InvalidSeatError";

export default class SeatChart<T> {
  private seats: T[];

  constructor() {
    this.seats = [];
  }

  public get length(): number {
    return this.seats.reduce((count) => count + 1, 0);
  }

  public erase(seat: number): void {
    if (seat < 0 || seat > 8) throw new InvalidSeatError(seat);
    delete this.seats[seat];
  }

  public read(seat: number): T | undefined {
    if (seat < 0 || seat > 8) throw new InvalidSeatError(seat);
    return this.seats[seat];
  }

  public write(seat: number, item: T): void {
    if (seat < 0 || seat > 8) throw new InvalidSeatError(seat);
    this.seats[seat] = item;
  }

  public forEach(callback: (item: T, index: number) => void): void {
    _.range(0, 9).forEach((i) => callback(this.seats[i], i));
  }

  public map<U>(callback: (item: T, index: number) => U): U[] {
    return _.range(0, 9).map((i) => callback(this.seats[i], i));
  }

  public reduce<U>(
    callback: (acc: U, item: T, index: number) => U,
    init: U
  ): U {
    return _.range(0, 9).reduce(
      (_acc, i) => callback(_acc, this.seats[i], i),
      init
    );
  }
}
