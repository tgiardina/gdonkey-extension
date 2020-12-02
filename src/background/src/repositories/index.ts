import { inject, injectable } from "inversify";
import Action from "./Action";
import Blind from "./Blind";
import Board from "./Board";
import Casino from "./Casino";
import Game from "./Game";
import Player from "./Player";
import Pocket from "./Pocket";
import Seat from "./Seat";
import Table from "./Table";
import TYPES from "../types";

export { Action, Blind, Board, Casino, Game, Player, Pocket, Seat, Table };

@injectable()
export class Repositories {
  constructor(
    @inject(TYPES.ActionRepo) public action: Action,
    @inject(TYPES.BlindRepo) public blind: Blind,
    @inject(TYPES.BoardRepo) public board: Board,
    @inject(TYPES.CasinoRepo) public casino: Casino,
    @inject(TYPES.GameRepo) public game: Game,
    @inject(TYPES.PlayerRepo) public player: Player,
    @inject(TYPES.PocketRepo) public pocket: Pocket,
    @inject(TYPES.SeatRepo) public seat: Seat,
    @inject(TYPES.TableRepo) public table: Table
  ) {}
}
