import Axios from "axios";
import grayIcon from "../../../../assets/images/icon-gray-128.png";
import greenIcon from "../../../../assets/images/icon-green-128.png";
import * as StatusCode from "./StatusCode";

async function persistLogin(username, token) {
  await browser.storage.sync.set({
    token,
    username,
  });
  browser.browserAction.setIcon({
    path: greenIcon,
  });
}

export async function getCookies() {
  const { username, token } = await browser.storage.sync.get([
    "token",
    "username",
  ]);
  return {
    isAuth: !!token,
    token,
    username,
  };
}

export async function getDb() {
  const url = `${process.env.REACT_APP_PLUGIN_API}/dump`;
  const { token } = await getCookies();
  const db = (
    await Axios.get(url, { headers: { Authorization: `Bearer ${token}` } })
  ).data;
  return new Blob([db], {
    type: "text/plain;charset=utf-8",
  });
}

export async function logIn(username, password) {
  if (username === "incorrect") return StatusCode.IncorrectUsername;
  if (password === "incorrect") return StatusCode.IncorrectPassword;
  const url = `${process.env.REACT_APP_AUTH_API}/sessions`;
  const response = await Axios.post(
    url,
    {
      session: {
        username,
        password,
      },
    },
    {
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 401,
    }
  );
  if (response.status === 200) {
    const session = response.data.session;
    await persistLogin(session.username, session.token);
    return StatusCode.Ok;
  } else {
    const property = response.data.errors[0].property;
    if (property === "username") {
      return StatusCode.IncorrectUsername;
    } else if (property === "password") {
      return StatusCode.IncorrectPassword;
    }
  }
}

export async function logOut() {
  await browser.storage.sync.clear();
  browser.browserAction.setIcon({
    path: grayIcon,
  });
}

export async function register(username, password) {
  if (username === "duplicate") return StatusCode.DuplicateUsername;
  if (username === "incorrect") return StatusCode.UnavailableUsername;
  const url = `${process.env.REACT_APP_AUTH_API}/users`;
  const response = await Axios.post(
    url,
    {
      user: {
        username,
        password,
      },
    },
    {
      validateStatus: (status) =>
        (status >= 200 && status < 300) || status === 409,
    }
  );
  if (response.status === 201) {
    const user = response.data.user;
    await persistLogin(user.username, user.token);
    return StatusCode.Ok;
  } else {
    const property = response.data.errors[0].property;
    if (property === "username") {
      return StatusCode.DuplicateUsername;
    }
  }
}
