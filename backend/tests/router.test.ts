import request from "supertest";
import { knexObj } from "../bookshelf";
import { buildRouter } from "../routes/router";

const router = buildRouter();
let userId = 1;

describe("Test users API", () => {
  test("Should be able to GET the list of users", async () => {
    const response = await request(router).get("/api/v1/users");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThanOrEqual(4);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
    expect(response.body[0]).toHaveProperty("pic");
    userId = response.body[0].id;
  });
});

describe("Test comments API V1", () => {
  test("Should fail if no header", async () => {
    const response = await request(router).get("/api/v1/comments");
    expect(response.statusCode).toBe(401);
  });

  test("Should be able to GET the list of comments", async () => {
    const response = await request(router)
      .get("/api/v1/comments")
      .set({ Authorization: "Bearer " + userId });
    expect(response.statusCode).toBe(200);
  });

  test("Should fail on invalid user id", async () => {
    const response = await request(router)
      .post("/api/v1/comments")
      .send({ comment: "hello" })
      .set({ Authorization: "Bearer 1000000" });
    expect(response.statusCode).toBe(401);
  });

  test("Should be able to create a comment", async () => {
    const response = await request(router)
      .post("/api/v1/comments")
      .send({ comment: "hello" })
      .set({ Authorization: "Bearer " + userId });
    expect(response.statusCode).toBe(201);
  });
});

describe("Test comments API V2", () => {
  test("Should fail if no header", async () => {
    const response = await request(router).get("/api/v2/comments");
    expect(response.statusCode).toBe(401);
  });

  test("Should be able to GET the list of comments", async () => {
    const response = await request(router)
      .get("/api/v2/comments")
      .set({ Authorization: "Bearer " + userId });
    expect(response.statusCode).toBe(200);
  });

  test("Should fail on invalid user id", async () => {
    const response = await request(router)
      .post("/api/v2/comments")
      .send({ comment: "hello" })
      .set({ Authorization: "Bearer 1000000" });
    expect(response.statusCode).toBe(401);
  });

  test("Should fail on empty comment", async () => {
    const response = await request(router)
      .post("/api/v2/comments")
      .send({ comment: "" })
      .set({ Authorization: "Bearer " + userId });
    expect(response.statusCode).toBe(400);
  });

  test("Should be able to create a comment", async () => {
    const response = await request(router)
      .post("/api/v2/comments")
      .send({ comment: "hello" })
      .set({ Authorization: "Bearer " + userId });
    expect(response.statusCode).toBe(201);
  });

  test("Should be able to create a nested comment", async () => {
    const createResponse = await request(router)
      .post("/api/v2/comments")
      .send({ comment: "hello" })
      .set({ Authorization: "Bearer " + userId });
    expect(createResponse.statusCode).toBe(201);

    const getResponse = await request(router)
      .get("/api/v2/comments")
      .set({ Authorization: "Bearer " + userId });
    expect(getResponse.statusCode).toBe(200);

    const createNestedResponse = await request(router)
      .post("/api/v2/comments")
      .send({ comment: "hello", parent_comment_id: getResponse.body[0].id })
      .set({ Authorization: "Bearer " + userId });
    expect(createNestedResponse.statusCode).toBe(201);
  });

  test("Should fail on invalid parent ID", async () => {
    const response = await request(router)
      .post("/api/v2/comments")
      .send({ comment: "hello", parent_comment_id: 1000000000 })
      .set({ Authorization: "Bearer " + userId });
    expect(response.statusCode).toBe(500);
  });
});

describe("Test upvotes", () => {
  test("Should fail PUT on invalid user ID", async () => {
    const response = await request(router)
      .put("/api/v2/upvote/1")
      .set({ Authorization: "Bearer 1000000" });
    expect(response.statusCode).toBe(401);
  });

  test("Should fail DELETE on invalid user ID", async () => {
    const response = await request(router)
      .delete("/api/v2/upvote/1")
      .set({ Authorization: "Bearer 1000000" });
    expect(response.statusCode).toBe(401);
  });

  test("Should fail PUT on invalid comment ID", async () => {
    const response = await request(router)
      .put("/api/v2/upvote/0")
      .set({ Authorization: "Bearer " + userId });
    expect(response.statusCode).toBe(500);
  });

  test("Working upvotes workflow", async () => {
    const createResponse = await request(router)
      .post("/api/v2/comments")
      .send({ comment: "hello" })
      .set({ Authorization: "Bearer " + userId });
    expect(createResponse.statusCode).toBe(201);

    const getResponse = await request(router)
      .get("/api/v2/comments")
      .set({ Authorization: "Bearer " + userId });
    expect(getResponse.statusCode).toBe(200);

    const response = await request(router)
      .put("/api/v2/upvote/" + getResponse.body[0].id)
      .set({ Authorization: "Bearer " + userId });
    expect(response.statusCode).toBe(201);

    const getResponse2 = await request(router)
      .get("/api/v2/comments")
      .set({ Authorization: "Bearer " + userId });
    expect(getResponse2.statusCode).toBe(200);
    expect(getResponse2.body[0].upvotes.length).toBeGreaterThan(
      getResponse.body[0].upvotes.length
    );

    // Try adding again; list of upvotes should not change
    const response2 = await request(router)
      .put("/api/v2/upvote/" + getResponse.body[0].id)
      .set({ Authorization: "Bearer " + userId });
    expect(response2.statusCode).toBe(201);

    const getResponse3 = await request(router)
      .get("/api/v2/comments")
      .set({ Authorization: "Bearer " + userId });
    expect(getResponse3.statusCode).toBe(200);
    expect(getResponse3.body[0].upvotes.length).toBe(
      getResponse2.body[0].upvotes.length
    );

    // Try adding again; list of upvotes should not change
    const response3 = await request(router)
      .delete("/api/v2/upvote/" + getResponse.body[0].id)
      .set({ Authorization: "Bearer " + userId });
    expect(response3.statusCode).toBe(200);

    const getResponse4 = await request(router)
      .get("/api/v2/comments")
      .set({ Authorization: "Bearer " + userId });
    expect(getResponse4.statusCode).toBe(200);
    expect(getResponse4.body[0].upvotes.length).toBeLessThan(
      getResponse3.body[0].upvotes.length
    );

    // Try deleting again; list of upvotes should not change
    const response4 = await request(router)
      .delete("/api/v2/upvote/" + getResponse.body[0].id)
      .set({ Authorization: "Bearer " + userId });
    expect(response4.statusCode).toBe(200);

    const getResponse5 = await request(router)
      .get("/api/v2/comments")
      .set({ Authorization: "Bearer " + userId });
    expect(getResponse5.statusCode).toBe(200);
    expect(getResponse5.body[0].upvotes.length).toBe(
      getResponse4.body[0].upvotes.length
    );
  });
});

afterAll((done) => {
  knexObj.destroy();
  done();
});
