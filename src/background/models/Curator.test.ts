import { Stopwatch, Tallier } from ".";
import { Action, Blind, Board, Casino, Game, Player, Pocket, Seat, Table } from "../entities";
import { Street } from "../enums";
import { UndefinedBoardError, UndefinedGameError, UndefinedSeatError } from "../errors";
import { SeatChart } from "../utils";
import Curator from "./Curator";

const getPublisher = (): unknown => ({
  id: 1,
  publish: jest.fn()
})

const getSyncer = (): unknown => ({
  id: 1,
  sync: jest.fn()
})

const getPockets = () => {
  const pockets = new SeatChart<Pocket>();
  pockets.write(0, <Pocket>Object.assign(getSyncer(), { seat: 0 }));
  pockets.write(1, <Pocket>Object.assign(getSyncer(), { seat: 1 }));
  return pockets
}

const getSpots = (isIded?: boolean): SeatChart<{ player: Player, seat: Seat }> => {
  const spots = new SeatChart<{ player: Player, seat: Seat }>();
  spots.write(0, {
    player: <Player>Object.assign(getSyncer(), isIded ? { id: 1 } : {}),
    seat: <Seat>Object.assign(getPublisher(), isIded ? { id: 1 } : {}),
  })
  spots.write(1, {
    player: <Player>Object.assign(getSyncer(), isIded ? { id: 1 } : {}),
    seat: <Seat>Object.assign(getPublisher(), isIded ? { id: 1 } : {}),
  })  
  return spots;
}

const arrangeGame = async (curator: Curator, options?: { isIded?: { spots: boolean }, withBlinds?: Blind[], withPockets?: Pocket[]}) => {
  const params = {
    casino: <Casino>getSyncer(),
    table: <Table>getSyncer(),
    game: <Game>getSyncer(),
    board: <Board>Object.assign(getSyncer(), { street: Street.Preflop }),
    spots: getSpots(options?.isIded?.spots),
    user: undefined,
    blinds: options ? options.withBlinds || [] : [],
    pockets: (() => {
      const pockets = new SeatChart<Pocket>()
      if(options?.withPockets) options.withPockets.forEach((pocket, seat) => pockets.write(seat, pocket))
      return pockets
    })(),
  }
  await curator.arrangeGame(params.casino, params.table, params.game, params.board, params.spots, params.user, params.blinds, params.pockets);
  return params
}

describe("Curator", () => {
  let curator: Curator;

  beforeEach(() => {
    const stopwatch = <Stopwatch><unknown>{
      click: () => 1000,
    };
    const tallier = <Tallier><unknown>{
      tally: () => 0,
    }
    curator = new Curator(stopwatch, tallier);
  })
  
  describe("arrangeGame", () => {
    it("should succeed", async () => {
      const { casino, table, game, spots } = await arrangeGame(curator);      
      const player0 = <Player>spots.read(0)?.player;
      const player1 = <Player>spots.read(1)?.player; 
      const seat0 = <Seat>spots.read(0)?.seat;
      const seat1 = <Seat>spots.read(1)?.seat;
      expect(casino.sync).toHaveBeenCalledTimes(1);
      expect(table.sync).toHaveBeenCalledTimes(1);
      expect(table.sync).toHaveBeenCalledWith(1);
      expect(game.sync).toHaveBeenCalledTimes(1);
      expect(game.sync).toHaveBeenCalledWith(1);
      expect(player0.sync).toHaveBeenCalledTimes(1);
      expect(player0.sync).toHaveBeenCalledWith(1); 
      expect(player1.sync).toHaveBeenCalledTimes(1);
      expect(player1.sync).toHaveBeenCalledWith(1);               
      expect(seat0.publish).toHaveBeenCalledTimes(1);
      expect(seat0.publish).toHaveBeenCalledWith(1, 1); 
      expect(seat1.publish).toHaveBeenCalledTimes(1);
      expect(seat1.publish).toHaveBeenCalledWith(1, 1);                       
    })

    it("should throw error if given blind not associated to a seat", () => {
      expect(() => arrangeGame(curator, { withBlinds: [ <Blind>{ seat: 2 } ]})).rejects.toThrow(new UndefinedSeatError(2));
    })

    it("should throw error if given pocket not associated to a seat", () => {
      const pockets: Pocket[] = [];
      pockets[2] = <Pocket>{};
      expect(() => arrangeGame(curator, { withPockets: pockets })).rejects.toThrow(new UndefinedSeatError(2));
    })    
  })

  describe("present action", () => {
    it("should succeed", async () => {
      const action = <Action>Object.assign(getPublisher(), { seat: 0 });
      await arrangeGame(curator);
      await curator.presentAction(action);
      expect(action.publish).toHaveBeenCalledTimes(1);
      expect(action.publish).toHaveBeenCalledWith(1, Street.Preflop, 0, 1000);
    })

    it("should throw error if board is not defined", async () => {
      const action = <Action>Object.assign(getPublisher(), { seat: 0 });
      await expect(() => curator.presentAction(action)).rejects.toThrow(new UndefinedBoardError())      
    })    

    it("should throw error if seat is undefined", async () => {
      const action = <Action>Object.assign(getPublisher(), { seat: 8 });
      await arrangeGame(curator);
      await expect(() => curator.presentAction(action)).rejects.toThrow(new UndefinedSeatError(8));
    })      
  })

  describe("board", () => {
    it("collect and present should succeed", async () => {
      const card = { rank: 0, suit: 0 };
      const { board } = await arrangeGame(curator);
      board.push = jest.fn();
      curator.collectBoard(card);
      await curator.presentBoard();
      expect(board.push).toHaveBeenCalledTimes(1);
      expect(board.push).toHaveBeenCalledWith(card);    
      expect(board.sync).toHaveBeenCalledTimes(1);
    })  

    it("should fail to collect if board is not defined", () => {
      const card = { rank: 0, suit: 0 };      
      expect(() => curator.collectBoard(card)).toThrow(new UndefinedBoardError())
    })

    it("should fail to present if game is not defined", async () => {
      await expect(() => curator.presentBoard()).rejects.toThrowError(new UndefinedGameError())    
    })    
  })  

  describe("exhibitGame", () => {
    it("should succeed", async () => {
      const pockets = getPockets();
      const { game, table } = await arrangeGame(curator, { isIded: { spots: true }});
      game.end = jest.fn();
      await curator.exhibitGame(pockets);
      expect(game.end).toHaveBeenCalledTimes(1);
      expect(game.sync).toHaveBeenCalledTimes(2);
      expect(game.sync).toHaveBeenCalledWith(table.id);
      expect(game.sync).toHaveBeenCalledWith(table.id);      
      expect(pockets.read(0)?.sync).toHaveBeenCalledTimes(1);
      expect(pockets.read(1)?.sync).toHaveBeenCalledTimes(1);
    })

    it("should throw error if game hasn't been arranged", async () => {
      const pockets = getPockets();      
      await expect(() => curator.exhibitGame(pockets)).rejects.toThrowError();
    })
  })  
});
