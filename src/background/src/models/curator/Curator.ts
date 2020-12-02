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
} from "../../entities";
import { 
  ActionType,
  BlindType,
} from '../../enums';
import {
  InactiveSeatError,
  UndefinedBoardError,
  UndefinedButtonError,
  UndefinedCasinoError,
  UndefinedGameError,
  UndefinedPlayerError,
  UndefinedSeatError,
  UndefinedTableError,
} from "../../errors";
import { Card } from "../../interfaces";
import Config from "../../interfaces/Config";
import { PositionMap, SeatChart } from "../../utils";
import Librarian from "../librarian/Librarian";
import Stopwatch from "../Stopwatch";
import StreetTallier from "../Tallier";

export default class Curator {
  private casino?: Casino;
  private table?: Table;
  private players?: SeatChart<Player>;
  private seats?: SeatChart<Seat>;
  private isActives: SeatChart<boolean>;
  private missedBlinds: SeatChart<boolean>;
  private pockets: SeatChart<Pocket>;
  private user?: number;
  private button?: number;
  private game?: Game;
  private actions: Action[];
  private board?: Board;

  constructor(private librarian: Librarian, private config: Config, private stopwatch: Stopwatch, private tallier: StreetTallier) {
    // This needs to stay in sync with this.hardReset().    
    this.actions = [];
    this.isActives = new SeatChart();
    this.missedBlinds = new SeatChart();
    this.pockets = new SeatChart();
  }

  public identifyUser(seat: number): void {
    this.user = seat;
  }

  public async arrangeGame(
    casino: Casino,
    table: Table,
    players: SeatChart<Player>,
    seats: SeatChart<Seat>,
    blinds: Blind[],
    pockets: SeatChart<Pocket>,
  ): Promise<void> {
    this.stopwatch.click();
    this.casino = casino;
    this.table = table;
    this.players = players;
    this.seats = seats;
    this.pockets = pockets;
    await this.casino.sync();
    await this.table.sync(<number>casino.id);
    await this.publishPlayers();
    await this.publishSeats();
    if(!this.config.hasImplicitBlinds) {
      await this.publishExplicitBlinds(blinds)
    } else {
      await this.publishImplicitBlinds();
    }
    await this.syncPockets();
  }

  public async recordAction(action: Action): Promise<void> {    
    if(!this.board) throw new UndefinedBoardError();
    const street = this.board.street;
    const delay = this.stopwatch.click();
    const tally = this.tallier.tally(street)
    const seatEntity = this.seats.read(seat);
    if(!seatEntity?.id) throw new UndefinedSeatError(action.seat);
    await action.publish(seatEntity.id, street, tally, delay);
  }

  public async collectBoard(...cards: Card[]): Promise<void> {
    if(!this.game?.id) throw new UndefinedGameError();
    if(!this.board) throw new UndefinedBoardError();
    this.board.push(...cards);
    await this.board.sync(this.game.id);
  }

  public async exhibitGame(): Promise<void> {
    if (this.game?.id === undefined) throw new UndefinedGameError();
    if (!this.board) throw new UndefinedBoardError();
    await Promise.all([
      this.publishActions(),
      this.board.sync(this.game.id),
      this.syncPockets(),
    ]);
  }

  private async publishPlayers(): Promise<void> {
    await Promise.all(
      this.isActives.map(async (isActive, seat) => {
        if (!isActive) return;
        const player = this.players.read(seat);
        if (!player) throw new InactiveSeatError(seat);
        if (this.casino?.id === undefined) throw new UndefinedCasinoError();
        player.isUser = this.user === seat;
        await player.sync(this.casino.id);
      })
    );
  }

  private async publishSeats(): Promise<void> {
    if (this.button === undefined) throw new UndefinedButtonError();
    const mapper = new PositionMap(this.button, this.isActives);
    await Promise.all(
      this.isActives.map(async (isActive, seat) => {
        if (!isActive) return;
        const player = this.players.read(seat);
        const seatEntity = this.seats?.read(seat);
        if (!seatEntity) throw new InactiveSeatError(seat);
        if (player?.id === undefined) throw new UndefinedPlayerError(seat);
        if (this.game?.id === undefined) throw new UndefinedGameError();
        await seatEntity.publish(this.game.id, player.id)
      })
    );
  }

  private async publishExplicitBlinds(blinds: Blind[]): Promise<void> {
    await Promise.all(
      blinds.map(async (blind) => {
        const seat = blind.seat;
        const seatEntity = this.seats.read(seat);
        if (seatEntity?.id === undefined) throw new UndefinedSeatError(seat);
        await blind.publish(seatEntity.id);
      })
    );
  }

  private async publishImplicitBlinds(): Promise<void> {
    if (!this.table) throw new UndefinedTableError();
    if (this.button === undefined) throw new UndefinedButtonError();
    const table = this.table;
    const mapper = new PositionMap(this.button, this.isActives);
    await Promise.all(
      this.isActives.map((isActive, seat) => {
        if (!isActive) return;
        const position = mapper.map(seat);
        const seatEntity = this.seats.read(seat);
        if (seatEntity?.id === undefined) throw new UndefinedSeatError(seat);
        if ((this.isActives.length === 2 && position === 0) || position === 1) {
          this.repos.blind
            .create(seat, BlindType.PostBlind, table.bigBlind)
            .publish(seatEntity.id);
        } else if (
          (this.isActives.length === 2 && position === 1) ||
          position === 0
        ) {
          this.repos.blind
            .create(seat, BlindType.PostBlind, table.smallBlind)
            .publish(seatEntity.id);
        }
      })
    );
  }

  private async publishMissedBlinds(): Promise<void> {
    if (!this.table) throw new UndefinedTableError();
    const table = this.table;
    await Promise.all(
      this.missedBlinds.map((isMissed, seat) => {
        const isActive = this.isActives.read(seat);
        const seatEntity = this.seats.read(seat);
        if (!(isMissed && isActive)) return;
        if (seatEntity?.id === undefined) throw new UndefinedSeatError(seat);
        this.repos.blind
          .create(seat, BlindType.PostBlind, table.bigBlind)
          .publish(seatEntity.id);
        this.missedBlinds.write(seat, false);
      })
    );
  }

  private async syncPockets(): Promise<void> {
    await Promise.all(
      this.pockets.map(async (pocket, seat) => {
        const seatEntity = this.seats.read(seat);
        if (seatEntity?.id === undefined) throw new UndefinedSeatError(seat);
        await pocket.sync(seatEntity.id);
      })
    );
  }

  private async publishActions(): Promise<void> {
    await Promise.all(
      this.actions.map(async (action) => {
        const seat = action.seat;
        const seatEntity = this.seats.read(seat);
        if (seatEntity?.id === undefined)
          throw new UndefinedSeatError(action.seat);
        await action.publish(seatEntity.id);
      })
    );
  }

  private hardReset(): void {
    this.actions = [];
    this.board = this.repos.board.create();    
    this.players = new SeatChart();
    this.seats = new SeatChart();
    this.stacks = new SeatChart();
    this.isActives = new SeatChart();
    this.missedBlinds = new SeatChart();
    this.pockets = new SeatChart();
    this.blinds = [];
  }

  private softReset(): void {
    this.actions = [];
    this.board = this.repos.board.create();    
    this.seats = new SeatChart();
    this.isActives = new SeatChart();
    this.pockets = new SeatChart();
    this.blinds = [];
  }  
}
