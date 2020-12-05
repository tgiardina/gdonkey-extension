import { InvalidSeatError } from "../../errors";
import InactiveSeatError from "../../errors/InactiveSeatError";
import SeatChart from "../../utils/seat-chart";

export default class PositionMap {
  private mapFn: SeatChart<number>;

  constructor(button: number, isActives: SeatChart<boolean>) {
    if (button < 0 || button > 8) throw new InvalidSeatError(button);
    let relPosition = 0;
    const map = new SeatChart<number>();
    for (let i = 0; i < 9; i++) {
      const seat = (button + i + 1) % 9;
      if (!isActives.read(seat)) continue;
      map.write(seat, relPosition);
      relPosition++;
    }
    this.mapFn = map;
  }

  public map(seat: number): number {
    const position = this.mapFn.read(seat);
    if (position === undefined) throw new InactiveSeatError(seat);
    return position;
  }
}
