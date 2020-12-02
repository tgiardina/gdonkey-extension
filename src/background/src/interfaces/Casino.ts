import Config from "./Config";
import TranslatorFactory from "./TranslatorFactory";

export default interface Casino<T> {
  config: Config;
  Translator: TranslatorFactory<T>;
}
