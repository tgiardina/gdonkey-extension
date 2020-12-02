import Casino from "../../interfaces/Casino";
import Translator from "../../interfaces/Translator";
import * as bovada from "./bovada";
import * as gpokr from "./gpokr";

const casinos: Record<string, Casino<unknown>> = {
  bovada,
  gpokr,
};

export default casinos;
