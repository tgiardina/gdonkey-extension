import {
  Action,
  Blind,
  Board,
  Casino,
  Game,
  Player,
  Pocket,
  Seat,
  Table,
} from "../entities";
import { ActionType, BlindSize, BlindType, Street } from "../enums";
import {
  InactiveSeatError,
  UndefinedButtonError,
  UndefinedGameError,
  UndefinedPlayerError,
  UndefinedStackError,
  UndefinedTableError,
} from "../errors";
import { Card } from "../interfaces";
import Config from "../interfaces/Config";
import { Repositories } from "../repositories";
import { SeatChart } from "../utils";
import { PositionMap } from "./";

export default class Librarian {
  private casino: Casino;
  private bigBlind?: number;
  private smallBlind?: number;
  private game?: Game;
  private players: SeatChart<Player>;
  private user?: number;
  private button?: number;
  private stacks: SeatChart<number>;
  private isActives: SeatChart<boolean>;
  private missedBlinds: SeatChart<boolean>;
  private blinds: Blind[];
  private pockets: SeatChart<Pocket>;

  constructor(private repos: Repositories, private config: Config) {
    this.casino = repos.casino.create(config.name);
    this.players = new SeatChart();
    this.stacks = new SeatChart();
    this.isActives = new SeatChart();
    this.missedBlinds = new SeatChart();
    this.blinds = [];
    this.pockets = new SeatChart();
  }

  public collectBlindSize(type: BlindSize, amount: number): void {
    if (type === BlindSize.Big) {
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

  public documentUser(seat: number): void {
    this.user = seat;
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

  public retrieveCasino(): Casino {
    return this.casino;
  }

  public retrieveTable(): Table {
    if (!(this.bigBlind && this.smallBlind)) throw new UndefinedTableError();
    return this.repos.table.create(this.bigBlind, this.smallBlind);
  }

  public retrieveGame(): Game {
    if (!this.game) throw new UndefinedGameError();
    return this.game;
  }

  public retrieveSpots(): SeatChart<{ player: Player; seat: Seat }> {
    if (this.button === undefined) throw new UndefinedButtonError();
    const mapper = new PositionMap(this.button, this.isActives);
    return this.isActives.reduce((seats, isActive, seat) => {
      const player = this.players.read(seat);
      const stack = this.stacks.read(seat);
      const position = mapper.map(seat);
      if (!player) throw new UndefinedPlayerError(seat);
      if (!stack) throw new UndefinedStackError(seat);
      const seatEntity = this.repos.seat.create(position, stack);
      seats.write(seat, { player, seat: seatEntity });
      return seats;
    }, <SeatChart<{ player: Player; seat: Seat }>>new SeatChart());
  }

  public retrieveUser(): number | undefined {
    return this.user;
  }

  public retrieveBlinds(): Blind[] {
    if (!this.config.hasImplicitBlinds) {
      return this.blinds;
    } else {
      return this.retrieveImplicitBlinds().concat(this.retrieveMissedBlinds());
    }
  }

  public retrievePockets(): SeatChart<Pocket> {
    return this.pockets;
  }

  public retrieveAction(
    seat: number,
    type: ActionType,
    amount?: number
  ): Action {
    if (!this.isActives.read(seat)) throw new InactiveSeatError(seat);
    return this.repos.action.create(seat, type, amount);
  }

  public retrieveNewBoard(): Board {
    return this.repos.board.create();
  }

  public isSeatActive(seat: number): boolean {
    return !!this.isActives.read(seat);
  }

  public emptyShelves(options?: {
    except?: { game?: boolean, players?: boolean; stacks?: boolean; user?: boolean };
  }): void {
    if (!options?.except?.game) delete this.game;    
    if (!options?.except?.players) this.players = new SeatChart();
    if (!options?.except?.stacks) this.stacks = new SeatChart();
    if (!options?.except?.user) delete this.user;
    this.isActives = new SeatChart();
    this.blinds = [];
    this.missedBlinds = new SeatChart();
    this.pockets = new SeatChart();
  }

  private retrieveImplicitBlinds(): Blind[] {
    if (!(this.bigBlind && this.smallBlind)) throw new UndefinedTableError();
    if (this.button === undefined) throw new UndefinedButtonError();
    const { bigBlind, smallBlind } = this;
    const mapper = new PositionMap(this.button, this.isActives);
    return this.isActives.reduce((blinds, isActive, seat) => {
      const position = mapper.map(seat);
      if (
        (this.isActives.length === 2 && position === 0) ||
        (this.isActives.length > 2 && position === 1)
      ) {
        blinds.push(
          this.repos.blind.create(seat, BlindType.PostBlind, bigBlind)
        );
        this.missedBlinds.erase(seat);
      } else if (
        (this.isActives.length === 2 && position === 1) ||
        (this.isActives.length > 2 && position === 0)
      ) {
        blinds.push(
          this.repos.blind.create(seat, BlindType.PostBlind, smallBlind)
        );
        this.missedBlinds.erase(seat);        
      }
      return blinds;
    }, <Blind[]>[]);
  }

  private retrieveMissedBlinds(): Blind[] {
    /* istanbul ignore next */
    if (!this.bigBlind) throw new UndefinedTableError();
    const bigBlind = this.bigBlind;
    return this.isActives.reduce((blinds, _isActive, seat) => {
      const isMissed = this.missedBlinds.read(seat);
      if (!isMissed) return blinds;
      blinds.push(this.repos.blind.create(seat, BlindType.PostBlind, bigBlind));
      this.missedBlinds.erase(seat);      
      return blinds;
    }, <Blind[]>[]);
  }
}
