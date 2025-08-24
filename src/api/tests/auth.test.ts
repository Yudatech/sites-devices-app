import { describe, it, expect, beforeEach } from "vitest";
import { login } from "@/api/auth";
import { api } from "@/api/client";
import MockAdapter from "axios-mock-adapter";
import type { User } from "../../types";

let mock: MockAdapter;

beforeEach(() => {
  mock = new MockAdapter(api);
  mock.reset();
});

describe("login()", () => {
  it("returns the first matched user", async () => {
    const users: User[] = [{ id: 1, username: "alice", password: "pw123" }];

    mock
      .onGet("/users", { params: { username: "alice", password: "pw123" } })
      .reply(200, users);

    const user = await login("alice", "pw123");
    expect(user).toEqual(users[0]);
  });

  it("throws for invalid credentials (empty result)", async () => {
    mock
      .onGet("/users", { params: { username: "bob", password: "bad" } })
      .reply(200, []);

    await expect(login("bob", "bad")).rejects.toThrow("Invalid credentials");
  });

  it("validates empty input", async () => {
    await expect(login("", "pw")).rejects.toThrow(
      "Username and password are required"
    );
    await expect(login("alice", "")).rejects.toThrow(
      "Username and password are required"
    );
  });

  it("normalizes network/HTTP errors", async () => {
    mock.onGet("/users").reply(500);
    await expect(login("alice", "pw")).rejects.toThrow(
      /Request failed with status code 500/
    );
  });
});
