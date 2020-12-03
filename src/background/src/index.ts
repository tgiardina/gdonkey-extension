import "reflect-metadata";
import getContainer from "./container";
import init from "./init";
import * as path from "path";

if (!process.env.NARRATION_API) throw new Error(".env is not set");

(async () => {
  const token = <string | null>(await browser.storage.sync.get("token")).token;
  if (token)
    browser.browserAction.setIcon({
      path: path.resolve(__dirname, "../../images/icon-green-128.png"),
    });
})();

init(getContainer(console.log));
