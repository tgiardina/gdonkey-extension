import { addInitMethod } from "@tgiardina/proxy-tools";
import { ActionType, BlindSize, BlindType } from "../enums";
import { InactiveSeatError } from "../errors";
import { Card } from "../interfaces";
import { Curator, Librarian } from "./";

export default class Controller {
  private curator: Curator;
  private isInit: boolean;

  constructor(curator: Curator, private librarian: Librarian) {
    this.curator = addInitMethod(curator, "clearExhibit");
    this.isInit = false;
  }

  public startNewProject(): void {
    this.librarian.emptyShelves();
  }

  public startNewGame(): void {
    this.librarian.emptyShelves({
      except: { players: true, stacks: true, user: true },
    });
    this.curator.clearExhibit();
    this.isInit = true;
  }

  public identifyGame(id: string): void {
    this.librarian.shelfGame(id);
  }

  public identifyBlind(type: BlindSize, amount: number): void {
    this.librarian.collectBlindSize(type, amount);
  }

  public identifyPlayer(seat: number, username?: string): void {
    this.librarian.shelfPlayer(seat, username);
  }

  public identifyStack(seat: number, stack: number): void {
    this.librarian.collectStack(seat, stack);
  }

  public identifyButton(seat: number): void {
    this.librarian.documentButton(seat);
  }

  public identifyUser(seat: number): void {
    this.librarian.documentUser(seat);
  }

  public activateSeat(seat: number): void {
    this.librarian.documentActiveSeat(seat);
  }

  public activateMissedBlind(seat: number): void {
    if (!this.librarian.isSeatActive(seat)) throw new InactiveSeatError(seat);
    this.librarian.documentMissedBlind(seat);
  }

  public async arrangeGame(): Promise<void> {
    if (!this.isInit) return;
    const casino = this.librarian.retrieveCasino();
    const table = this.librarian.retrieveTable();
    const game = this.librarian.retrieveGame();
    const board = this.librarian.retrieveNewBoard();
    const spots = this.librarian.retrieveSpots();
    const user = this.librarian.retrieveUser();
    const blinds = this.librarian.retrieveBlinds();
    const pockets = this.librarian.retrievePockets();
    await this.curator.arrangeGame(
      casino,
      table,
      game,
      board,
      spots,
      user,
      blinds,
      pockets
    );
  }

  public recordBlind(seat: number, type: BlindType, amount: number): void {
    this.librarian.shelfBlind(seat, type, amount);
  }

  public recordPocket(seat: number, card1: Card, card2: Card): void {
    this.librarian.shelfPocket(seat, card1, card2);
  }

  public async recordAction(
    seat: number,
    type: ActionType,
    amount?: number
  ): Promise<void> {
    const action = this.librarian.retrieveAction(seat, type, amount);
    await this.curator.presentAction(action);
  }

  public async collectBoard(...cards: Card[]): Promise<void> {
    this.curator.collectBoard(...cards);
    await this.curator.presentBoard();
  }

  public async exhibitGame(): Promise<void> {
    if (!this.isInit) return;
    const pockets = this.librarian.retrievePockets();
    await this.curator.exhibitGame(pockets);
  }
}
