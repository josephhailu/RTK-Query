import { delay, http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";

import { factory, oneOf, manyOf, primaryKey } from "@mswjs/data";
import { nanoid } from "@reduxjs/toolkit";

import faker from "faker";

const NUM_USERS = 3;
const POSTS_PER_USER = 3;
const RECENT_NOTIFICATIONS_DAYS = 7;

/* MSW Data Model Setup */

export const db = factory({
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    name: String,
    username: String,
    posts: manyOf("post"),
  },
  post: {
    id: primaryKey(nanoid),
    title: String,
    date: String,
    user: oneOf("user"),
  },
});

const createUserData = () => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    username: faker.internet.userName(),
  };
};

const createPostData = (user) => {
  return {
    title: faker.lorem.words(),
    date: faker.date.recent(RECENT_NOTIFICATIONS_DAYS).toISOString(),
    user,
  };
};

// Create an initial set of users and posts
for (let i = 0; i < NUM_USERS; i++) {
  const author = db.user.create(createUserData());

  for (let j = 0; j < POSTS_PER_USER; j++) {
    const newPost = createPostData(author);
    db.post.create(newPost);
  }
}

const serializePost = (post) => ({
  ...post,
  user: post.user.id,
});

/* MSW REST API Handlers */

export const handlers = [
  http.get("/fakeApi/posts", async (req, res, ctx) => {
    const posts = db.post.getAll().map(serializePost);
    await delay();
    return HttpResponse.json(posts);
  }),
  http.delete("/fakeApi/posts/:postId", async (req, res, ctx) => {
    db.post.delete({
      where: { id: { equals: req.params.postId } },
    });
    await delay();
    return HttpResponse.json({ msg: "delete successful", status: "ok" });
  }),
];

export const worker = setupWorker(...handlers);
