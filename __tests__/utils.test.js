const {
  convertTimestampToDate,
  checkItemExists,
} = require("../db/seeds/utils");

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

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("checkItemExists", () => {
  test("returnes undefined if the item exists in the database", () => {
    return checkItemExists("articles", "article_id", 1).then((result) => {
      expect(result).toBe(undefined);
    });
  });

  test("retunrs an error if the item does not exist", () => {
    return checkItemExists("articles", "article_id", 999).catch((err) => {
      expect(err).toEqual({
        status: 404,
        message: "Item not found",
      });
    });
  });
});
