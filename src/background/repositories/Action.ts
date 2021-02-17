import { Action } from "../entities";
import { ActionType } from "../enums";
import Wire from "../models/wire";

export default class ActionRepository {
  constructor(private wire: Wire) {}

  public create(seat: number, type: ActionType, amount?: number): Action {
    return new Action(this.wire, seat, type, amount);
  }
}
