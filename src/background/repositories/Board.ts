import { Board } from "../entities";
import Wire from "../models/wire";

export default class BoardRepository {
  constructor(private wire: Wire) {}

  public create(): Board {
    return new Board(this.wire);
  }
}
