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
  test("404: Responds with 404 status and an error message 'No topics found' if no topics exist", () => {
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

describe("GET /api/articles/1", () => {
  test("200: Responds with an object containing the requested article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const article = body.article;
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: Responds with an error message 'Bad request'", () => {
    return request(app)
      .get("/api/articles/numberone")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("404: Responds with an error message 'Article not found'", () => {
    return request(app)
      .get("/api/articles/2000")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an object, containing an array of all the articles sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles;
        const article = articles[0];

        expect(articles.length).toBe(13);

        expect(articles).toBeSorted({ descending: true, key: "created_at" });

        expect(typeof article.comment_count).toBe("string");
        expect(article.body).toBe(undefined);
      });
  });
  test("404: Responds with an error message 'Route not found'", () => {
    return request(app)
      .get("/api/articless")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Route not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments;
        const comment = comments[0];

        expect(comments.length).toBe(11);
        expect(comments).toBeSorted({ descending: true, key: "created_at" });

        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          article_id: 1,
        });
      });
  });
  test("404: Responds with an error message 'Article not found' if article doesn't exist", () => {
    return request(app)
      .get("/api/articles/2000/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Article not found");
      });
  });
  test("400: Responds with an error message 'Bad request' if article_id is the incorrect data type", () => {
    return request(app)
      .get("/api/articles/numberone/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("201: Responds with an object containg the posted  comment", () => {
    const newComment = { username: "butter_bridge", body: "Hello NC News!" };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment;
        expect(comment).toMatchObject({
          comment_id: expect.any(Number),
          article_id: 1,
          author: "butter_bridge",
          body: "Hello NC News!",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("400: responds with error message if body is missing fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          message:
            "Required field not completed. Please provide username and body.",
        });
      });
  });
  test("404: responds with error message if article doesn't exist", () => {
    const newComment = { username: "butter_bridge", body: "Hello NC News!" };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          message: "Article doesn't exist.",
        });
      });
  });
  test("400: Responds with an error message 'Bad request' if article_id is the incorrect data type", () => {
    const newComment = { username: "butter_bridge", body: "Hello NC News!" };
    return request(app)
      .post("/api/articles/nine/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          message: "Bad request",
        });
      });
  });
});
