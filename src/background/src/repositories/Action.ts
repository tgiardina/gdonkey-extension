import { Action } from "../entities";
import { ActionType } from "../enums";
import Wire from "../models/wire";
import TYPES from "../types";
import { inject, injectable } from "inversify";

@injectable()
export default class ActionRepository {
  constructor(
    @inject(TYPES.Wire) private wire: Wire,
  ) {}

  public create(
    seat: number,
    type: ActionType,
    amount?: number
  ): Action {
    return new Action(this.wire, seat, type, amount);
  }
}
