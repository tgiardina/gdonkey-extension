import ActionType from "../../../interfaces/ActionType";
import BlindType from "../../../interfaces/BlindType";
import { GameEventId } from "./game-event";
import { Translator } from "./";
import Curator from "../../../entities/curator";

const curator = ({
  activateSeat: jest.fn(),
  billMissedBlind: jest.fn(),
  concatBoard: jest.fn(),
  init: jest.fn(),
  pushAction: jest.fn(),
  setBlind: jest.fn(),
  setButton: jest.fn(),
  setGameId: jest.fn(),
  setPlayer: jest.fn(),
  setPocket: jest.fn(),
  setStack: jest.fn(),
  startNewGame: jest.fn(),
} as unknown) as Curator;
const translator = new Translator(curator);

describe("translate function", () => {
  beforeEach(jest.clearAllMocks);

  it("should translate BetRaise correctly", () => {
    const bet = { amount: 50, seat: 8 };
    translator.translate({
      ...bet,
      typeName: <GameEventId>"BetRaiseEvent",
    });
    expect(curator.pushAction).toBeCalledTimes(1);
    expect(curator.pushAction).toBeCalledWith(
      bet.seat,
      ActionType.BetRaise,
      bet.amount
    );
  });

  it("should translate CheckCall correctly", () => {
    const check = { seat: 6 };
    translator.translate({ ...check, typeName: <GameEventId>"CheckCallEvent" });
    expect(curator.pushAction).toBeCalledTimes(1);
    expect(curator.pushAction).toBeCalledWith(check.seat, ActionType.CheckCall);
  });

  it("should translate Flop correctly", () => {
    const flop = [
      { suit: 1, rank: 10 },
      { suit: 2, rank: 0 },
      { suit: 0, rank: 12 },
    ];
    translator.translate({
      card1: flop[0],
      card2: flop[1],
      card3: flop[2],
      typeName: <GameEventId>"FlopEvent",
    });
    expect(curator.concatBoard).toBeCalledTimes(1);
    expect(curator.concatBoard).toBeCalledWith(
      ...flop.map((card) => ({ suit: card.suit, rank: card.rank }))
    );
  });

  it("should translate Init correctly", () => {
    const initObject = {
      table: {
        gameInfo: {
          playerInfo: [
            {
              forceBlind: false,
              user: {
                name: "PlayerA",
              },
            },
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            {
              forceBlind: true,
              user: {
                name: "PlayerB",
              },
            },
          ],
        },
      },
    };
    translator.translate({
      ...initObject,
      typeName: <GameEventId>"TableUpdateEvent",
    });
    expect(curator.setPlayer).toBeCalledTimes(2);
    expect(curator.setPlayer).toBeCalledWith(0, "PlayerA");
    expect(curator.setPlayer).toBeCalledWith(8, "PlayerB");
    expect(curator.billMissedBlind).toBeCalledTimes(1);
    expect(curator.billMissedBlind).toBeCalledWith(8);
  });

  it("should translate Pocket correctly", () => {
    const pocket = {
      seat: 7,
      cards: [
        { suit: 0, rank: 9 },
        { suit: 2, rank: 5 },
      ],
    };
    translator.translate({
      seat: pocket.seat,
      card1: pocket.cards[0],
      card2: pocket.cards[1],
      typeName: <GameEventId>"PocketCardsEvent",
    });
    expect(curator.setPocket).toBeCalledTimes(1);
    expect(curator.setPocket).toBeCalledWith(
      pocket.seat,
      ...pocket.cards.map((card) => ({ suit: card.suit, rank: card.rank }))
    );
  });

  it("should translate River correctly", () => {
    translator.translate({
      card1: { suit: 0, rank: 0 },
      typeName: <GameEventId>"RiverEvent",
    });
    expect(curator.concatBoard).toBeCalledTimes(1);
    expect(curator.concatBoard).toBeCalledWith({ suit: 0, rank: 0 });
  });

  it("should translate Showdown correctly", () => {
    const pocket = {
      seat: 0,
      cards: [
        { suit: 0, rank: 9 },
        { suit: 2, rank: 5 },
      ],
    };
    translator.translate({
      seat: pocket.seat,
      card1: pocket.cards[0],
      card2: pocket.cards[1],
      typeName: <GameEventId>"ShowCardsEvent",
    });
    expect(curator.setPocket).toBeCalledTimes(1);
    expect(curator.setPocket).toBeCalledWith(
      pocket.seat,
      ...pocket.cards.map((card) => ({ suit: card.suit, rank: card.rank }))
    );
  });

  it("should translate Sit correctly", () => {
    const player = {
      seat: 1,
      user: {
        name: "PlayerA",
      },
    };
    translator.translate({
      player,
      typeName: <GameEventId>"SitDownEvent",
    });
    expect(curator.setPlayer).toBeCalledTimes(1);
    expect(curator.setPlayer).toBeCalledWith(player.seat, player.user.name);
    expect(curator.billMissedBlind).toBeCalledTimes(1);
    expect(curator.billMissedBlind).toBeCalledWith(1);
  });

  it("should translate Start correctly", () => {
    const gameObject = {
      smallblind: 25,
      bigblind: 50,
      chips: [1500, 0, 0, 0, 0, 5000, 0, 0, 0],
      dealer: 5,
      gameId: 200,
    };
    translator.translate({
      ...gameObject,
      typeName: <GameEventId>"StartHandEvent",
    });
    expect(curator.startNewGame).toBeCalledTimes(1);
    expect(curator.setGameId).toBeCalledTimes(1);
    expect(curator.setGameId).toBeCalledWith(gameObject.gameId.toString());
    expect(curator.setButton).toBeCalledTimes(1);
    expect(curator.setButton).toBeCalledWith(gameObject.dealer);
    expect(curator.setStack).toBeCalledTimes(2);
    expect(curator.setStack).toBeCalledWith(0, gameObject.chips[0]);
    expect(curator.setStack).toBeCalledWith(5, gameObject.chips[5]);
    expect(curator.activateSeat).toBeCalledTimes(2);
    expect(curator.activateSeat).toBeCalledWith(0);
    expect(curator.activateSeat).toBeCalledWith(5);
    expect(curator.setBlind).toBeCalledTimes(2);
    expect(curator.setBlind).toBeCalledWith(
      BlindType.Small,
      gameObject.smallblind
    );
    expect(curator.setBlind).toBeCalledWith(BlindType.Big, gameObject.bigblind);
  });

  it("should translate Turn correctly", () => {
    translator.translate({
      card1: { suit: 0, rank: 0 },
      typeName: <GameEventId>"TurnEvent",
    });
    expect(curator.concatBoard).toBeCalledTimes(1);
    expect(curator.concatBoard).toBeCalledWith({ suit: 0, rank: 0 });
  });
});
