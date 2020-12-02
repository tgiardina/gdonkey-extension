import { Action, Blind, Board, Casino, Game, Player, Pocket } from "../../entities";
import { ActionType, BlindSize, BlindType, Street } from "../../enums";
import { Card } from "../../interfaces";
import { Repositories } from "../../repositories";
import { SeatChart } from "../../utils";

export default class Librarian {
  private casinos?: Casino;
  private bigBlind?: number;
  private smallBlind?: number;
  private game?: Game;
  private players: SeatChart<Player>;
  private button?: number;
  private stacks: SeatChart<number>;
  private isActives: SeatChart<boolean>;
  private missedBlinds: SeatChart<boolean>;
  private blinds: Blind[];
  private pockets: SeatChart<Pocket>;

  constructor(private repos: Repositories) {
    this.players = new SeatChart();
    this.stacks = new SeatChart();
    this.isActives = new SeatChart();
    this.missedBlinds = new SeatChart();
    this.blinds = [];
    this.pockets = new SeatChart();
  }

  public shelfCasino(name: string): void {
    this.repos.casino.create(name);
  }

  public collectBlindSize(type: BlindSize, amount: number): void {
    if(type === BlindSize.Big) {
      this.bigBlind = amount;
    } else {
      this.smallBlind = amount;
    }
  }

  public shelfGame(id: string): void {
    this.game = this.repos.game.create(id);
  }

  public shelfPlayer(seat: number, username?: string): void {
    this.players.write(seat, this.repos.player.create(seat, username));
  }

  public collectStack(seat: number, stack: number): void {
    this.stacks.write(seat, stack);
  }

  public documentButton(seat: number): void {
    this.button = seat;
  }

  public documentActiveSeat(seat: number) {
    this.isActives.write(seat, true);
  }

  public documentMissedBlind(seat: number) {
    this.missedBlinds.write(seat, true);
  }

  public shelfBlind(seat: number, type: BlindType, amount: number): void {
    this.blinds.push(this.repos.blind.create(seat, type, amount));
  }

  public shelfPocket(seat: number, card1: Card, card2: Card): void {
    this.pockets.write(seat, this.repos.pocket.create(seat, card1, card2));
  }

  public retrieveAction(seat: number, type: ActionType, amount?: number): Action {
    return this.repos.action.create(seat, type, amount);
  }

  public retrieveNewBoard(): Board {
    return this.repos.board.create();
  }
  
  public emptyShelves(options?: { except?: { players: boolean }}): void {
    if(!options?.except?.players) this.players = new SeatChart();
    this.stacks = new SeatChart();
    this.isActives = new SeatChart();
    this.missedBlinds = new SeatChart();
    this.blinds = [];
    this.pockets = new SeatChart();
  }
}