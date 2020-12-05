import { injectable } from "inversify";
import { Street } from "../enums";

@injectable()
export default class StreetTallier {
  private currStreet: Street;
  private currTally: number;

  constructor() {
    this.currStreet = Street.Preflop;
    this.currTally = 0;
  }

  public tally(street: Street): number {
    if (this.currStreet === street) {
      return this.currTally++;
    } else {
      this.currStreet = street;
      this.currTally = 0;
      return this.currTally++;
    }
  }
}
