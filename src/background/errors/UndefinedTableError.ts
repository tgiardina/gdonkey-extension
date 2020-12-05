export default class UndefinedTableError extends Error {
  constructor() {
    super(`Attempted to start game without table`);
  }
}
