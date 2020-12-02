import Curator from "../../../m/curator";
import ActionType from "../../../interfaces/ActionType";
import BlindType from "../../../interfaces/BlindType";
import Card from "../../../interfaces/Card";
import * as gameEvent from "./game-event";

type GameEvent = gameEvent.GameEvent;
const GameEventId = gameEvent.GameEventId;

function translateCard(card: { rank: number; suit: number }): Card {
  return {
    rank: card.rank,
    suit: card.suit,
  };
}

export default class Translator {
  constructor(private curator: Curator) {}

  public translate(event: GameEvent): void {
    if (!event) return;
    const id = event.typeName;
    if (id === GameEventId.BetRaise) {
      this.translateBetRaise(<gameEvent.BetRaise>event);
    } else if (id === GameEventId.CheckCall) {
      this.translateCheckCall(<gameEvent.CheckCall>event);
    } else if (id === GameEventId.End) {
      this.translateEnd();
    } else if (id === GameEventId.Flop) {
      this.translateFlop(<gameEvent.Flop>event);
    } else if (id === GameEventId.Fold) {
      this.translateFold(<gameEvent.Fold>event);
    } else if (id === GameEventId.Init) {
      this.translateInit();
      this.translatePlayers(<gameEvent.Init>event);
    } else if (id === GameEventId.Pocket) {
      this.translatePocket(<gameEvent.Pocket>event);
    } else if (id === GameEventId.River) {
      this.translateTurnRiver(<gameEvent.River>event);
    } else if (id === GameEventId.Showdown) {
      this.translateShowdown(<gameEvent.Showdown>event);
    } else if (id === GameEventId.Sit) {
      this.translateSit(<gameEvent.Sit>event);
    } else if (id === GameEventId.Start) {
      this.translateStart();
      this.translateGameId(<gameEvent.Start>event);
      this.translateButton(<gameEvent.Start>event);
      this.translateStacks(<gameEvent.Start>event);
      this.translateBlinds(<gameEvent.Start>event);
    } else if (id === GameEventId.Turn) {
      this.translateTurnRiver(<gameEvent.River>event);
    }
  }

  private translateBetRaise(event: gameEvent.BetRaise): void {
    this.curator.pushAction(event.seat, ActionType.BetRaise, event.amount);
  }

  private translateBlinds(event: gameEvent.Start): void {
    this.curator.setBlind(BlindType.Small, event.smallblind);
    this.curator.setBlind(BlindType.Big, event.bigblind);
  }

  private translateButton(event: gameEvent.Start): void {
    this.curator.setButton(event.dealer);
  }

  private translateCheckCall(event: gameEvent.CheckCall): void {
    this.curator.pushAction(event.seat, ActionType.CheckCall);
  }

  private translateEnd(): void {
    this.curator.endGame();
  }

  private translateFlop(event: gameEvent.Flop): void {
    const cards = [event.card1, event.card2, event.card3].map(translateCard);
    this.curator.concatBoard(...cards);
  }

  private translateFold(event: gameEvent.Fold): void {
    this.curator.pushAction(event.seat, ActionType.Fold);
  }

  private translateGameId(event: gameEvent.Start): void {
    this.curator.setGameId(event.gameId.toString());
  }

  private translateInit(): void {
    this.curator.init();
  }

  private translatePlayers(event: gameEvent.Init): void {
    for (let seat = 0; seat < 9; seat++) {
      const player = event.table.gameInfo.playerInfo[seat];
      if (!player) continue;
      this.curator.setPlayer(seat, player.user.name);
      if (player.forceBlind) this.curator.billMissedBlind(seat);
    }
  }

  private translatePocket(event: gameEvent.Pocket): void {
    const cards = [event.card1, event.card2].map(translateCard);
    this.curator.setPocket(event.seat, cards[0], cards[1]);
  }

  private translateShowdown(event: gameEvent.Showdown): void {
    const cards = [event.card1, event.card2].map(translateCard);
    this.curator.setPocket(event.seat, cards[0], cards[1]);
  }

  private translateSit(event: gameEvent.Sit): void {
    this.curator.setPlayer(event.player.seat, event.player.user.name);
    this.curator.billMissedBlind(event.player.seat);
  }

  private translateStacks(event: gameEvent.Start): void {
    for (let seat = 0; seat < 9; seat++) {
      const stack = event.chips[seat];
      if (stack) {
        this.curator.setStack(seat, event.chips[seat]);
        this.curator.activateSeat(seat);
      }
    }
  }

  private translateStart(): void {
    this.curator.startNewGame();
  }

  private translateTurnRiver(event: gameEvent.Turn): void {
    this.curator.concatBoard(translateCard(event.card1));
  }
}
