export default class UndefinedGameError extends Error {
  constructor() {
    super(`Attempted to start game without gameId`);
  }
}
