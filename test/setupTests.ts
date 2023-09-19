import { cleanup } from "@testing-library/react";
import matchars from "@testing-library/jest-dom/matchers";
import { rest } from "msw";
import { setupServer } from "msw/node";

expect.extend(matchars);

export const handlers = [
  rest.get("/test/v1/me", async (_req, res, ctx) => {
    return await res(
      ctx.json({
        createTime: "2022-04-06T04:08:09+00:00",
        email: "archie.wu@getoken.io",
        id: "95fed9d7-2d9f-4c79-9617-4012708e09e0",
        updateTime: "2022-05-06T10:33:51+00:00",
      })
    );
  }),
];
export const server = setupServer(...handlers);
// Enable the API mocking before tests.
beforeAll(() => server.listen());
// Reset any runtime request handlers we may add during the tests.
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
// Disable the API mocking after the tests finished.
afterAll(() => server.close());
