export default class UninitiatedSpotsError extends Error {
  constructor() {
    super("Spots have not yet been set.");
  }
}
