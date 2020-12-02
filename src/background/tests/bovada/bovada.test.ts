import wsSniffer from "./sniffer";
import baseTest from "../baseTest";

baseTest("bovada", jest.fn(), wsSniffer);
