const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function verifyId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response
      .status(400)
      .json("Logger :: Error Message :: Id isn't valid");
  }

  return next();
}

app.get("/repositories", (_request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const id = uuid();

  if (!isUuid(id)) {
    return response
      .status(400)
      .json("Logger :: Error Message :: Id isn't valid");
  }

  const repository = { id, title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", verifyId, (request, response) => {
  const { title, url, techs } = request.body;

  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repositories) => repositories.id === id
  );

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Logger :: Error Message :: Project not found." });
  }

  const repository = { title, url, techs };

  repositories[repositoryIndex].title = repository.title;
  repositories[repositoryIndex].url = repository.url;
  repositories[repositoryIndex].techs = repository.techs;

  return response.json(repositories[repositoryIndex]);
});

app.delete("/repositories/:id", verifyId, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repositories) => repositories.id === id
  );

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Logger :: Error Message :: Project not found." });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repositories) => repositories.id === id
  );

  if (repositoryIndex < 0) {
    return response
      .status(400)
      .json({ error: "Logger :: Error Message :: Project not found." });
  }

  repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1;

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
