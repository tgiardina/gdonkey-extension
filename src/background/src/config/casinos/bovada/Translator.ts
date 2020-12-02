import Curator from "../../../m/curator";
import ActionType from "../../../interfaces/ActionType";
import BlindType from "../../../interfaces/BlindSize";
import Card from "../../../interfaces/Card";
import * as gameEvent from "./game-event";

type GameEvent = gameEvent.GameEvent;
const GameEventId = gameEvent.GameEventId;

const translateCard = (card: number): Card => ({
  rank: (card + 12) % 13,
  suit: Math.floor(card / 13),
});

const translateSeat = (seat: number): number => seat - 1;

export default class Translator {
  constructor(private curator: Curator) {}

  public translate(event: GameEvent): void {
    if (!event) return;
    const id = event.pid;
    if (id === GameEventId.Action) {
      this.translateAction(<gameEvent.Action>event);
    } else if (id === GameEventId.Blind) {
      this.translateBlind(<gameEvent.Blind>event);
    } else if (id === GameEventId.Button) {
      this.translateButton(<gameEvent.Button>event);
    } else if (id === GameEventId.Flop) {
      this.translateFlop(<gameEvent.Flop>event);
    } else if (id === GameEventId.GameId) {
      this.translateGameId(<gameEvent.GameId>event);
    } else if (id === GameEventId.GameType) {
      this.translateInit();
      this.translateGameType(<gameEvent.GameType>event);
    } else if (id === GameEventId.Pocket) {
      this.translatePocket(<gameEvent.Pocket>event);
    } else if (id === GameEventId.Pockets) {
      this.translatePockets(<gameEvent.Pockets>event);
    } else if (id === GameEventId.Sit) {
      this.translateSit(<gameEvent.Sit>event);
    } else if (id === GameEventId.Stack) {
      this.translateStack(<gameEvent.Stack>event);
    } else if (id === GameEventId.FinalStacks) {
      this.translateEnd();
      this.translateStacks(<gameEvent.FinalStacks>event);
    } else if (id === GameEventId.Start) {
      this.translateStart(<gameEvent.Start>event);
    } else if (id === GameEventId.TurnRiver) {
      this.translateTurnRiver(<gameEvent.TurnRiver>event);
    }
  }

  private translateAction(event: gameEvent.Action): void {
    const type =
      event.btn === 1024
        ? ActionType.Fold
        : [64, 256].includes(event.btn)
        ? ActionType.CheckCall
        : ActionType.BetRaise;
    if (type === ActionType.BetRaise) {
      const amount = event.raise || event.bet;
      this.curator.pushAction(translateSeat(event.seat), type, amount);
    } else {
      this.curator.pushAction(translateSeat(event.seat), type);
    }
  }

  private translateBlind(event: gameEvent.Blind): void {
    this.curator.pushBlind(
      translateSeat(event.seat),
      ActionType.PostBlind,
      event.bet
    );
    if (event.dead)
      this.curator.pushBlind(
        translateSeat(event.seat),
        ActionType.Donate,
        event.dead
      );
  }

  private translateButton(event: gameEvent.Button): void {
    this.curator.setButton(translateSeat(event.seat));
  }

  private translateEnd(): void {
    this.curator.endGame();
  }

  private translateFlop(event: gameEvent.Flop): void {
    this.curator.concatBoard(...event.bcard.map(translateCard));
  }

  private translateGameId(event: gameEvent.GameId): void {
    this.curator.setGameId(event.stageNo);
  }

  private translateGameType(event: gameEvent.GameType): void {
    this.curator.setBlind(BlindType.Big, event.bblind);
    this.curator.setBlind(BlindType.Small, event.sblind);
  }

  private translateInit(): void {
    this.curator.init();
  }

  private translatePocket(event: gameEvent.Pocket): void {
    const cards = event.card.map(translateCard);
    this.curator.setPocket(translateSeat(event.seat), cards[0], cards[1]);
  }

  private translatePockets(event: gameEvent.Pockets): void {
    for (const prop in event) {
      if (prop.slice(0, 4) === "seat") {
        const seat = translateSeat(parseInt(prop[4]));
        const pocket = <[number, number]>event[prop];
        this.curator.activateSeat(seat);
        if (pocket[0] < 52)
          this.curator.setPocket(
            seat,
            translateCard(pocket[0]),
            translateCard(pocket[1])
          );
      }
    }
  }

  private translateSit(event: gameEvent.Sit): void {
    if (event.type) {
      const seat = translateSeat(event.seat);
      this.curator.setPlayer(seat);
      this.curator.setStack(seat, event.account);
      if (event.nickName.length) this.curator.markAsUser(seat);
    }
  }

  private translateStack(event: gameEvent.Stack): void {
    this.curator.setStack(translateSeat(event.seat), event.cash);
  }

  private translateStacks(event: gameEvent.FinalStacks): void {
    event.account.map((stack, index) => {
      if (stack) this.curator.setStack(index, stack);
    });
  }

  private translateStart(event: gameEvent.Start): void {
    if (event.tableState === 2) this.curator.startNewGame();
  }

  private translateTurnRiver(event: gameEvent.TurnRiver): void {
    this.curator.concatBoard(translateCard(event.card));
  }
}
