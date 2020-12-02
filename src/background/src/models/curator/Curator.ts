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
  UninitiatedSpotsError,
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
  private spots?: SeatChart<{ player: Player, seat: Seat }>;
  private pockets: SeatChart<Pocket>;
  private user?: number;
  private game?: Game;
  private board?: Board;
  private actions: Action[];

  constructor(private librarian: Librarian, private config: Config, private stopwatch: Stopwatch, private tallier: StreetTallier) {
    this.pockets = new SeatChart();
    this.actions = [];
  }

  public identifyUser(seat: number): void {
    this.user = seat;
  }

  public async arrangeGame(
    casino: Casino,
    table: Table,
    game: Game,
    board: Board,
    spots: SeatChart<{ player: Player, seat: Seat}>,
    blinds: Blind[],
    pockets: SeatChart<Pocket>,
  ): Promise<void> {
    this.stopwatch.click();
    this.casino = casino;
    this.table = table;
    this.game = game;
    this.board = board;
    this.spots = spots;
    this.pockets = pockets;
    await this.casino.sync();
    await this.table.sync(<number>this.casino.id);
    await this.game.sync(<number>this.table.id)
    await this.publishPlayers();
    await this.publishSeats();
    await Promise.all([
      this.publishBlinds(blinds),
      this.syncPockets(),
    ])
  }

  public async presentAction(action: Action): Promise<void> {
    if(!this.board) throw new UndefinedBoardError();
    if(!this.spots) throw new UndefinedSeatError(action.seat);
    const street = this.board.street;
    const delay = this.stopwatch.click();
    const tally = this.tallier.tally(street)
    const seatEntity = this.spots.read(action.seat)?.seat;
    if(!seatEntity?.id) throw new UndefinedSeatError(action.seat);
    await action.publish(seatEntity.id, street, tally, delay);
  }

  public collectBoard(...cards: Card[]): void {
    if(!this.board) throw new UndefinedBoardError();
    this.board.push(...cards);
  }

  public async presentBoard(): Promise<void> {
    if(!this.game?.id) throw new UndefinedGameError();    
    if(!this.board) throw new UndefinedBoardError();    
    await this.board.sync(this.game.id);
  }

  public async exhibitGame(pockets: SeatChart<Pocket>): Promise<void> {
    if (this.game?.id === undefined) throw new UndefinedGameError();
    if (!this.board) throw new UndefinedBoardError();
    this.pockets = pockets;
    await this.syncPockets();    
  }

  private async publishPlayers(): Promise<void> {
    if(this.casino?.id === undefined) throw new UndefinedCasinoError();
    if(!this.spots) throw new UninitiatedSpotsError();
    const casinoId = this.casino.id;
    await Promise.all(
      this.spots.map(async ({ player }) => {
        if (this.casino?.id === undefined) throw new UndefinedCasinoError();
        player.isUser = this.user === player.seat;
        await player.sync(this.casino.id);
      })
    );
  }

  private async publishSeats(): Promise<void> {
    if(!this.game?.id) throw new UndefinedGameError();
    if(!this.spots) throw new UninitiatedSpotsError();
    const gameId = this.game.id;
    await Promise.all(
      this.spots.map(async ({ seat, player }) => {
        if(!player.id) throw new UndefinedPlayerError(player.seat);
        await seat.publish(gameId, player.id)
      })
    );
  }

  private async publishBlinds(blinds: Blind[]): Promise<void> {
    if(!this.spots) throw new UninitiatedSpotsError();    
    const spots = this.spots;
    await Promise.all(
      blinds.map(async (blind) => {
        const seat = spots.read(blind.seat)?.seat;
        if (seat?.id === undefined) throw new UndefinedSeatError(blind.seat);
        await blind.publish(seat.id);
      })
    );
  }

  private async syncPockets(): Promise<void> {
    if(!this.spots) throw new UninitiatedSpotsError();        
    const spots = this.spots
    await Promise.all(
      this.pockets.map(async (pocket) => {
        const seat = spots.read(pocket.seat)?.seat;
        if (seat?.id === undefined) throw new UndefinedSeatError(pocket.seat);
        await pocket.sync(seat.id);
      })
    );
  }
}
