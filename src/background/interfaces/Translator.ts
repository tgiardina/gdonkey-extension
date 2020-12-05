export default interface Translator<T> {
  translate(event: T): void;
}
