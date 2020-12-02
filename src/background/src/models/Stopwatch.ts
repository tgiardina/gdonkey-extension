export default class Stopwatch {
  private lastClickedAt: number;

  constructor() {
    this.lastClickedAt = Date.now();
  }

  public click(): number {
    const clickedAt = Date.now();
    const lastClickedAt = this.lastClickedAt;
    this.lastClickedAt = clickedAt;
    return clickedAt - lastClickedAt;
  }
}
