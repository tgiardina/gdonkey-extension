import "jest-extended";
import { ActionType, BlindSize, CasinoName } from '../../../enums';
import { Repositories } from "../../../repositories";
import Curator from "../Curator";
import mockedRepos from './mockedRepos';
import mockedConfig from './mockedConfig';

describe("Curator", () => {
  describe("arrangeGame", () => {
    it("should not throw any errors", async () => {
      const curator = new Curator(<Repositories><unknown>mockedRepos, mockedConfig)
      curator.identifyBlind(BlindSize.Small, 25);
      curator.identifyBlind(BlindSize.Big, 50);      
      curator.startNewProject();
      curator.startNewGame();
      curator.identifyGame("abc");
      curator.identifyPlayer(0, "playerA");
      curator.identifyUser(0);
      curator.identifyPlayer(1, "playerB");      
      curator.identifyPlayer(2, "playerC");      
      curator.identifyStack(0, 1500);
      curator.identifyStack(1, 1500);      
      curator.identifyStack(2, 1500);      
      curator.identifyButton(0);
      curator.activateSeat(0);
      curator.activateSeat(1);
      await curator.arrangeGame();
    });
  });

  //   it("should have called dispatcher.useCasino in order", () => {
  //     expect(dispatcher.useCasino).toHaveBeenCalledTimes(1);
  //     expect(dispatcher.useCasino).toHaveBeenCalledWith("casino");
  //     expect(dispatcher.useCasino).toHaveBeenCalledBefore(dispatcher.useTable);
  //     expect(dispatcher.useCasino).toHaveBeenCalledBefore(dispatcher.sitPlayer);
  //   });

  //   it("should have called dispatcher.useTable in order", () => {
  //     expect(dispatcher.useTable).toHaveBeenCalledTimes(1);
  //     expect(dispatcher.useTable).toHaveBeenCalledWith(50);
  //     expect(dispatcher.useTable).toHaveBeenCalledBefore(dispatcher.startGame);
  //   });

  //   it("should have called dispatcher.sitPlayer in order", () => {
  //     expect(dispatcher.sitPlayer).toHaveBeenCalledTimes(2);
  //     expect(dispatcher.sitPlayer).toHaveBeenCalledWith(0, "playerA", true);
  //     expect(dispatcher.sitPlayer).toHaveBeenCalledWith(1, "playerB", false);
  //     expect(dispatcher.sitPlayer).toHaveBeenCalledBefore(
  //       dispatcher.configureSeat
  //     );
  //   });

  //   it("should have called dispatcher.startGame in order", () => {
  //     expect(dispatcher.startGame).toHaveBeenCalledTimes(1);
  //     expect(dispatcher.startGame).toHaveBeenCalledWith(
  //       "11",
  //       expect.anything()
  //     );
  //     expect(dispatcher.startGame).toHaveBeenCalledBefore(
  //       dispatcher.configureSeat
  //     );
  //   });

  //   it("should have called dispatcher.configureSeat in order", () => {
  //     expect(dispatcher.configureSeat).toHaveBeenCalledTimes(2);
  //     expect(dispatcher.configureSeat).toHaveBeenCalledWith(0, 1, 1500);
  //     expect(dispatcher.configureSeat).toHaveBeenCalledWith(1, 0, 1500);
  //     expect(dispatcher.configureSeat).toHaveBeenCalledBefore(
  //       dispatcher.executeAction
  //     );
  //   });
  // });
});
