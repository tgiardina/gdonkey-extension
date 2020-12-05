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
import Wire from "../models/wire";

export { Action, Blind, Board, Casino, Game, Player, Pocket, Seat, Table };

@injectable()
export class Repositories {
  public action: Action;
  public blind: Blind;
  public board: Board;
  public casino: Casino;
  public game: Game;
  public player: Player;
  public pocket: Pocket;
  public seat: Seat;
  public table: Table;

  constructor(@inject(TYPES.Wire) wire: Wire) {
    this.action = new Action(wire);
    this.blind = new Blind(wire);
    this.board = new Board(wire);
    this.casino = new Casino(wire);
    this.game = new Game(wire);
    this.player = new Player(wire);
    this.pocket = new Pocket(wire);
    this.seat = new Seat(wire);
    this.table = new Table(wire);
  }
}
