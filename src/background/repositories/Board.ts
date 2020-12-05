import { Board } from "../entities";
import Wire from "../models/wire";
import TYPES from "../types";

export default class BoardRepository {
  constructor(private wire: Wire) {}

  public create(): Board {
    return new Board(this.wire);
  }
}
