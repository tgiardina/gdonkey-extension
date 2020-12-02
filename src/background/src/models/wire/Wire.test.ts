import { AxiosStatic } from "axios";
import Wire from "./";

const userResponse = { data: { user: { id: 1 } } };
const axiosStub = <AxiosStatic>(<unknown>{
  post: jest.fn(() => userResponse),
  get: jest.fn(() => userResponse),
  put: jest.fn(),
  patch: jest.fn(),
});
const dest = "server";
let sign: () => string | undefined;
let wire: Wire;

describe("Wire", () => {
  describe("post", () => {
    beforeAll(() => {
      sign = () => "token";
      wire = new Wire(axiosStub, dest, sign);
    });

    it("should post", async () => {
      const user = await wire.post("/user", {
        name: "john doe",
      });
      expect(user).toEqual(userResponse.data.user);
      expect(axiosStub.post).toHaveBeenCalledTimes(1);
      expect(axiosStub.post).toHaveBeenCalledWith(
        `${dest}/user`,
        {
          name: "john doe",
        },
        { headers: { Authorization: `Bearer token` } }
      );
    });
  });

  describe("get", () => {
    beforeAll(() => {
      sign = () => undefined;
      wire = new Wire(axiosStub, dest, sign);
    });

    it("should get", async () => {
      const user = await wire.get("/user");
      expect(user).toEqual({ id: 1 });
      expect(axiosStub.get).toHaveBeenCalledTimes(1);
      expect(axiosStub.get).toHaveBeenCalledWith(`${dest}/user`, undefined);
    });
  });

  describe("put", () => {
    beforeAll(() => {
      sign = () => "token";
      wire = new Wire(axiosStub, dest, sign);
    });

    it("should put", async () => {
      await wire.put("/user", {
        name: "john doe",
      });
      expect(axiosStub.put).toHaveBeenCalledTimes(1);
      expect(axiosStub.put).toHaveBeenCalledWith(
        `${dest}/user`,
        {
          name: "john doe",
        },
        { headers: { Authorization: `Bearer token` } }
      );
    });
  });

  describe("patch", () => {
    beforeAll(() => {
      sign = () => "token";
      wire = new Wire(axiosStub, dest, sign);
    });

    it("should patch", async () => {
      await wire.patch("/user", {
        name: "john doe",
      });
      expect(axiosStub.patch).toHaveBeenCalledTimes(1);
      expect(axiosStub.patch).toHaveBeenCalledWith(
        `${dest}/user`,
        {
          name: "john doe",
        },
        { headers: { Authorization: `Bearer token` } }
      );
    });
  });
});
