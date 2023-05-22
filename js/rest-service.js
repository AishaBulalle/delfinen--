import { prepareData } from "./helpers.js";

const endpoint = "https://delfin-54ecb-default-rtdb.firebaseio.com/";

async function getPosts() {
  const response = await fetch(`${endpoint}/medlemmer.json`);
  const data = await response.json();
  return prepareData(data);
}
/*
async function getUser(id) {
  const response = await fetch(`${endpoint}/users/${id}.json`);
  const user = await response.json();
  return user;
}*/

async function createPost(
  navn,
  billede,
  alder,
  aktivitetsform,
  medlemskabstype,
  svømmedisciplin
) {
  const newPost = {
    navn,
    billede,
    alder,
    aktivitetsform,
    medlemskabstype,
    svømmedisciplin,
  }; // create new post object
  const json = JSON.stringify(newPost); // convert the JS object to JSON string
  // POST fetch request with JSON in the body
  const response = await fetch(`${endpoint}/medlemmer.json`, {
    method: "POST",
    body: json,
  });
  return response;
}

async function updatePost(
  id,
  navn,
  billede,
  alder,
  aktivitetsform,
  medlemskabstype,
  svømmedisciplin
) {
  const postToUpdate = {
    id,
    navn,
    billede,
    alder,
    aktivitetsform,
    medlemskabstype,
    svømmedisciplin,
  }; // post update to update
  const json = JSON.stringify(postToUpdate); // convert the JS object to JSON string
  // PUT fetch request with JSON in the body. Calls the specific element in resource
  const response = await fetch(`${endpoint}/medlemmer/${id}.json`, {
    method: "PATCH",
    body: json,
  });
  return response;
}

async function deletePost(id) {
  const response = await fetch(`${endpoint}/medlemmer/${id}.json`, {
    method: "DELETE",
  });
  return response;
}

export { getPosts, createPost, updatePost, deletePost };
