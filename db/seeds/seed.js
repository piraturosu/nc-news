const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate } = require("../../db/seeds/utils");
const { articleData } = require("../data/test-data");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query("DROP TABLE IF EXISTS comments")
    .then(() => {
      return db.query("DROP TABLE IF EXISTS articles");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS users");
    })
    .then(() => {
      return db.query("DROP TABLE IF EXISTS topics");
    })
    .then(() => {
      return createTopics();
    })
    .then(() => {
      return createUsers();
    })
    .then(() => {
      return createArticles();
    })
    .then(() => {
      return createComments();
    })
    .then(() => {
      return insertTopics(topicData);
    })
    .then(() => {
      return insertUsers(userData);
    })
    .then(() => {
      return insertArticles(articleData);
    })
    .then((res) => {
      const articles = res.rows;
      return formatComments(commentData, articles);
    })
    .then((res) => {
      return insertComments(res);
    });
};

function createTopics() {
  return db.query(`CREATE TABLE topics
    (
    slug VARCHAR PRIMARY KEY,
    description VARCHAR NOT NULL,
    img_url VARCHAR (1000)
    )
    `);
}

function createUsers() {
  return db.query(`CREATE TABLE users
    (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR (1000)
    )
    `);
}

function createArticles() {
  return db.query(`CREATE TABLE articles
    (
    article_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    topic VARCHAR NOT NULL,
    author VARCHAR NOT NULL,
    body TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    votes INT DEFAULT 0,
    article_img_url VARCHAR (1000),
    FOREIGN KEY (topic) REFERENCES topics(slug) ON DELETE CASCADE,
    FOREIGN KEY (author) REFERENCES users(username) ON DELETE CASCADE
    )
    `);
}

function createComments() {
  return db.query(`CREATE TABLE comments
    (
    comment_id SERIAL PRIMARY KEY,
    article_id INT NOT NULL,
    body TEXT NOT NULL,
    votes INT DEFAULT 0,
    author VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
    FOREIGN KEY (author) REFERENCES users(username) ON DELETE CASCADE
    )
    `);
}

function insertTopics(topicsData) {
  const topicsArr = topicsData.map((topic) => {
    return [topic.slug, topic.description, topic.img_url];
  });
  return db.query(
    format(
      `INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *`,
      topicsArr,
    ),
  );
}

function insertUsers(usersData) {
  const usersArr = usersData.map((user) => {
    return [user.username, user.name, user.avatar_url];
  });
  return db.query(
    format(
      `INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *`,
      usersArr,
    ),
  );
}

function insertArticles(articlesData) {
  const correctDateArr = articlesData.map((el) => convertTimestampToDate(el));
  const articlesArr = correctDateArr.map((article) => {
    return [
      article.title,
      article.topic,
      article.author,
      article.body,
      article.created_at,
      article.votes ? article.votes : (article.votes = 0),
      article.article_img_url,
    ];
  });
  return db.query(
    format(
      `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
      articlesArr,
    ),
  );
}

function formatComments(commentsData, articlesData) {
  const correctDateArr = commentsData.map((el) => convertTimestampToDate(el));
  const addedArticleIdArr = correctDateArr.map((comment) => {
    const commentArticleName = comment.article_title;

    for (const article of articlesData) {
      if (commentArticleName === article.title) {
        comment["article_id"] = article.article_id;
        delete comment.article_title;
        return comment;
      }
    }
  });
  return addedArticleIdArr;
}

function insertComments(commentsData) {
  const commentsArr = commentsData.map((comment) => {
    return [
      comment.article_id,
      comment.body,
      comment.votes,
      comment.author,
      comment.created_at,
    ];
  });
  return db.query(
    format(
      `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *`,
      commentsArr,
    ),
  );
}

module.exports = seed;
