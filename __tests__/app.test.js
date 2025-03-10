const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const { app } = require("../app");

const db = require("../db/connection");
const data = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
/* Set up your beforeEach & afterAll functions here */

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an object that contains an array of all the topics in the database", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBe(3);

        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
  test("404: Responds with 404 status and a 'No topics found' if tno topics exist", () => {
    db.query("DELETE FROM topics").then(() => {
      return request(app)
        .get("/api/topics")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("No topics found");
        });
    });
  });
});
