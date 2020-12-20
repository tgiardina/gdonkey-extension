import { ActionType, BlindSize, BlindType } from '../enums';
import { InactiveSeatError, UndefinedButtonError, UndefinedGameError, UndefinedPlayerError, UndefinedStackError, UndefinedTableError } from '../errors';
import { CasinoConfig } from '../interfaces';
import { Repositories } from "../repositories";
import Librarian from "./Librarian";

const generateRepo = () => ({
  create: jest.fn(() => "dummy"),
})

describe("Librarian", () => {
  let repos: Repositories;
  let librarian: Librarian;

  beforeEach(() => {
    repos = <Repositories><unknown> {
      action: generateRepo(),
      blind: generateRepo(),
      board: generateRepo(),
      casino: generateRepo(),
      game: generateRepo(),
      player: generateRepo(),
      pocket: generateRepo(),
      seat: generateRepo(),
      table: generateRepo(),  
    }
    const config = <CasinoConfig><unknown>{
      name: "gpokr",
      hasImplicitBlinds: true,
    }
    librarian = new Librarian(repos, config);
  })

  it("should retrieve casino", () => {
    expect(librarian.retrieveCasino()).toEqual("dummy");
    expect(repos.casino.create).toHaveBeenCalledTimes(1);
    expect(repos.casino.create).toHaveBeenCalledWith("gpokr");
  });

  it("should document, retrieve, and reset user", () => {
    librarian.documentUser(0);
    expect(librarian.retrieveUser()).toEqual(0);
    librarian.emptyShelves();
    expect(librarian.retrieveUser()).toEqual(undefined);
  })

  it("should document, retrieve, and reset blinds", () => {
    librarian.documentActiveSeat(0);
    librarian.documentActiveSeat(1);        
    librarian.documentActiveSeat(2);    
    librarian.documentMissedBlind(0);
    librarian.documentMissedBlind(1);    
    expect(() => librarian.retrieveBlinds()).toThrow(new UndefinedTableError());
    librarian.collectBlindSize(BlindSize.Big, 50);
    expect(() => librarian.retrieveBlinds()).toThrow(new UndefinedTableError());    
    librarian.collectBlindSize(BlindSize.Small, 25);    
    expect(() => librarian.retrieveBlinds()).toThrow(new UndefinedButtonError());    
    librarian.documentButton(0);
    expect(librarian.retrieveBlinds()).toEqual(["dummy", "dummy", "dummy"]);
    expect(repos.blind.create).toHaveBeenCalledTimes(3);
    expect(repos.blind.create).toHaveBeenCalledWith(1, BlindType.PostBlind, 25);  
    expect(repos.blind.create).toHaveBeenCalledWith(2, BlindType.PostBlind, 50);      
    expect(repos.blind.create).toHaveBeenCalledWith(0, BlindType.PostBlind, 50);          
    expect(librarian.retrieveBlinds()).toEqual(["dummy", "dummy"]);
  })  

  it("should document, remember, and clear active seats", () => {
    expect(librarian.isSeatActive(0)).toEqual(false);
    librarian.documentActiveSeat(0);
    expect(librarian.isSeatActive(0)).toEqual(true);    
    librarian.emptyShelves();
    expect(librarian.isSeatActive(0)).toEqual(false);    
  })

  it("should collect and retrieve table", () => {
    expect(() => librarian.retrieveTable()).toThrow(new UndefinedTableError());
    librarian.collectBlindSize(BlindSize.Small, 25);
    expect(() => librarian.retrieveTable()).toThrow(new UndefinedTableError());    
    librarian.collectBlindSize(BlindSize.Big, 50);
    expect(librarian.retrieveTable()).toEqual("dummy");
    expect(repos.table.create).toHaveBeenCalledTimes(1);
    expect(repos.table.create).toHaveBeenCalledWith(50, 25);
  })

  it("should shelf, retrieve, and clear game", () => {
    expect(() => librarian.retrieveGame()).toThrow(new UndefinedGameError());
    librarian.shelfGame("1");
    expect(librarian.retrieveGame()).toEqual("dummy");
    expect(repos.game.create).toHaveBeenCalledTimes(1);    
    expect(repos.game.create).toHaveBeenCalledWith("1");
    librarian.emptyShelves();
    expect(() => librarian.retrieveGame()).toThrow(new UndefinedGameError());
  })  

  it("should shelf, retrieve, and clear spots", () => {
    expect(() => librarian.retrieveSpots()).toThrow(new UndefinedButtonError());
    librarian.documentButton(1);
    librarian.documentActiveSeat(0);
    librarian.documentActiveSeat(1);    
    librarian.documentActiveSeat(2);        
    expect(() => librarian.retrieveSpots()).toThrow(new UndefinedPlayerError(0));    
    librarian.shelfPlayer(0, "a");
    librarian.shelfPlayer(1, "b");    
    librarian.shelfPlayer(2, "c");    
    expect(() => librarian.retrieveSpots()).toThrow(new UndefinedStackError(0));
    librarian.collectStack(0, 1500)
    librarian.collectStack(1, 1501)    
    librarian.collectStack(2, 1502)    
    expect(librarian.retrieveSpots().map(spot => spot)).toEqual([{player: "dummy", seat: "dummy"},{player: "dummy", seat: "dummy"},{player: "dummy", seat: "dummy"},])
    expect(repos.player.create).toHaveBeenCalledTimes(3);    
    expect(repos.seat.create).toHaveBeenCalledTimes(3);        
    expect(repos.seat.create).toHaveBeenCalledWith(0, 1502);
    expect(repos.seat.create).toHaveBeenCalledWith(1, 1500);
    expect(repos.seat.create).toHaveBeenCalledWith(2, 1501);    
    expect(repos.player.create).toHaveBeenCalledWith(0, "a");
    expect(repos.player.create).toHaveBeenCalledWith(1, "b");
    expect(repos.player.create).toHaveBeenCalledWith(2, "c");        
    librarian.emptyShelves();
    librarian.documentButton(1);    
    librarian.documentActiveSeat(0);    
    expect(() => librarian.retrieveSpots()).toThrow(new UndefinedPlayerError(0));    
    librarian.shelfPlayer(0, "a");    
    expect(() => librarian.retrieveSpots()).toThrow(new UndefinedStackError(0));    
  })    

  it("should throw error if attempting to retrieve action from inactive seat", () => {
    expect(() => librarian.retrieveAction(0, ActionType.CheckCall)).toThrow(new InactiveSeatError(0));
  })
});
