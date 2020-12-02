import { InvalidSeatError } from "../../errors";
import InactiveSeatError from "../../errors/InactiveSeatError";
import SeatChart from "../seat-chart";

export default class PositionMap {
  private mapFn: SeatChart<number>;

  constructor(button: number, isActives: SeatChart<boolean>) {
    if (button < 0 || button > 8) throw new InvalidSeatError(button);
    let relPosition = 0;
    const map: SeatChart<number> = new SeatChart();
    for (let i = 0; i < 9; i++) {
      const currPosition = (button + i) % 9;
      if (isActives.read(currPosition)) {
        map.write(currPosition, relPosition);
        relPosition++;
      }
    }
    this.mapFn = map;
  }

  public map(seat: number): number {
    const position = this.mapFn.read(seat);
    if (position === undefined) throw new InactiveSeatError(seat);
    return position;
  }
}
