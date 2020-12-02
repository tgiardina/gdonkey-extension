import { Board } from "../entities";
import Wire from "../models/wire";
import TYPES from "../types";
import { inject, injectable } from "inversify";

@injectable()
export default class BoardRepository {
  constructor(@inject(TYPES.Wire) private wire: Wire) {}

  public create(): Board {
    return new Board(this.wire);
  }
}
