import { GameType } from "gdonkey-translators/src/enums";

export default class InvalidTableError extends Error {
  constructor(public casinoId: number, public gameType: GameType, public bigBlind: number) {
    super(
      `Casino number ${casinoId} does not have a ${gameType} table with ${bigBlind} big blinds.`
    );
  }
}
