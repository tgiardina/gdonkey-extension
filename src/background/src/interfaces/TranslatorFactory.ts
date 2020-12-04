import { Curator } from "../models";
import Translator from "./Translator";

export default interface TranslatorFactory<T> {
  new (curator: Curator): Translator<T>;
}
