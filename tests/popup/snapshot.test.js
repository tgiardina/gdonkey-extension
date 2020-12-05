import 'dotenv';
import axios from 'axios';
import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import FileSaver from "file-saver";
import App from "../../src/popup/js/App";

// Mocks
jest.mock('axios');
axios.post.mockResolvedValue({ data: { user: { username: "user", token: "token" }}, status: 201});
axios.get.mockResolvedValue({ data: "I am a database" });
jest.mock("file-saver", () => ({ saveAs: jest.fn() }));
global.browser = {
  browserAction: {
    setIcon: () => {},
  },
  storage: {
    sync: {
      get: () => {},
      set: () => {},
      clear: () => {
        const username = global.browser.storage.sync.get().username;
        global.browser.storage.sync.get = () => {
          username;
        };
      },
    },
  },
};

// Helpers
const getDownloadButton = () => screen.getByText("Download DB");
const getLogInButton = () => screen.getByText("Register");
const getLogOutButton = () => screen.getByText("Log Out");
const getPasswordInput = () => screen.getByPlaceholderText("password");
const getUsernameInput = () => screen.getByPlaceholderText("username");

// Tests
describe("Snapshot tests", () => {
  describe("Logged out", () => {
    let container;
    beforeEach(async () => {
      const cookie = {
        username: "username",
        token: null,
      };
      global.browser.storage.sync.get = () => cookie;
      ({ container } = render(<App />));
      await waitFor(() => {
        expect(getUsernameInput().value).toEqual(cookie.username);
      });
    });

    it("Should render Login properly", () => {
      expect(container).toMatchSnapshot();
    });

    it("Should log in successfully", async () => {
      fireEvent.change(getUsernameInput(), {
        target: { value: "fake-username" },
      });
      fireEvent.change(getPasswordInput(), {
        target: { value: "fake-password" },
      });
      fireEvent.click(getLogInButton());
      await waitForElementToBeRemoved(getLogInButton);
      expect(container).toMatchSnapshot();
    });
  });

  describe("Logged in", () => {
    let container;
    beforeEach(async () => {
      const cookie = {
        username: "username",
        token: "fake-token",
      };
      global.browser.storage.sync.get = () => cookie;
      ({ container } = render(<App />));
      await waitForElementToBeRemoved(getLogInButton());
      await waitFor(() => {
        expect(getUsernameInput().value).toEqual(cookie.username);
      });
    });

    it("Should render Logout properly", () => {
      expect(container).toMatchSnapshot();
    });

    it("Should successfully download DB file", async () => {
      const downloadButton = getDownloadButton();
      expect(downloadButton).toBeInDocument;
      fireEvent.click(downloadButton);
      await waitFor(() => expect(FileSaver.saveAs).toHaveBeenCalledTimes(1));
      expect(FileSaver.saveAs).toHaveBeenCalledWith(
        expect.any(Object),
        "gdonkey.sql"
      );
    });

    it("Should successfully log out", async () => {
      fireEvent.click(getLogOutButton());
      expect(container).toMatchSnapshot();
    });
  });
});
