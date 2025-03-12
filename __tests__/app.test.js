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
          article_id: 1,
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

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with an object containing the modified articles with the votes property updated where votes is a positive value", () => {
    const votes = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;

        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 101,
          article_img_url: expect.any(String),
        });
      });
  });
  test("200: Responds with an object containing the modified articles with the votes property updated where votes is a negative value", () => {
    const votes = { inc_votes: -25 };

    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(200)
      .then(({ body }) => {
        const article = body.article;

        expect(article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 75,
          article_img_url: expect.any(String),
        });
      });
  });
  test("404: Responds with an error message 'Item not found' if article doesn't exist", () => {
    const votes = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/2000")
      .send(votes)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Item not found");
      });
  });
  test("400: Responds with an error message 'Bad request' if article_id is the incorrect data type", () => {
    const votes = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/numberone")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("400: Responds with an error message 'Bad request' if vote value is the incorrect data type", () => {
    const votes = { inc_votes: "one" };

    return request(app)
      .patch("/api/articles/1")
      .send(votes)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
  test("400: responds with error message if body is missing fields", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({
          message:
            "Required field not completed. Please provide username and body.",
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with an empty content and deletes the comment provided from db", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return db.query("SELECT * FROM comments WHERE comment_id = 1");
      })
      .then(({ rows }) => {
        expect(rows.length).toBe(0);
      });
  });
  test("404: Responds with an error message 'Item not found'", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Item not found");
      });
  });
  test("400: Responds with an error message 'Bad request' if comment id is not the correct data type", () => {
    return request(app)
      .delete("/api/comments/nine")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad request");
      });
  });
});
describe("GET /api/users", () => {
  test("200: Responds with an object that contains an array of all the users in the database", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        const user = users[0];

        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);

        expect(user).toMatchObject({
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        });
      });
  });
  test("404: Responds with 404 status and an error message 'No users found' if no users exist", () => {
    db.query("DELETE FROM users").then(() => {
      return request(app)
        .get("/api/users")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("No users found");
        });
    });
  });
});
