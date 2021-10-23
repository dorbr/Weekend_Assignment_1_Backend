const express = require("express");
const router = express();
const {
  NotFoundPokemons,
  UserAlreadyHavePokemon,
  UserDoesNotHavePokemon,
  ServerError,
  UserDoesNotExist,
} = require("../middleware/errors");
const fs = require("fs");
const Pokedex = require("pokedex-promise-v2");

const P = new Pokedex();

router.get("/", async function (request, response, next) {
  const username = request.headers.username;
  if (await isUserExist(username))
    response.send(await getPokemonListFromUser(username));
  else {
    try {
      throw new UserDoesNotExist();
    } catch (err) {
      next(err);
    }
  }
});
router.get("/get/:id", async function (request, response, next) {
  const { id } = request.params;
  const pokemon = await getPokemonFromApi(id);
  if (pokemon) {
    response.send(pokemon);
  } else {
    try {
      throw new NotFoundPokemons();
    } catch (error) {
      next(error);
    }
  }
});
router.get("/query", async function (request, response, next) {
  const { name } = request.query;
  const pokemon = await getPokemonFromApi(name);
  if (pokemon) {
    response.json(pokemon);
  } else {
    try {
      throw new NotFoundPokemons();
    } catch (error) {
      next(error);
    }
  }
});
router.put("/catch/:id", async function (request, response, next) {
  const { id } = request.params;
  const username = request.headers.username;
  try {
    if ((await addPokemonToUser(username, id)) === true) {
      response.send("Cought");
    }
  } catch (error) {
    next(error);
  }
});
router.delete("/release/:id", async function (request, response, next) {
  const { id } = request.params;
  let username = request.headers.username;
  try {
    if ((await deletePokemonFromUser(username, id)) === true) {
      response.send("Released");
    }
  } catch (error) {
    next(error);
  }
});

function getPokemonFromApi(id) {
  return P.getPokemonByName(id)
    .then(function (res) {
      pokemon = {
        name: res.name,
        height: res.height,
        weight: res.weight,
        types: res.types,
        frontPic: res.sprites.front_default,
        backPic: res.sprites.back_default,
        abilities: res.abilities,
      };
      return pokemon;
    })
    .catch((err) => {
      console.log(err);
    });
}
function isPokemonExist(id, user) {
  return fs.promises
    .readdir(`./Server/src/db/users/${user}`)
    .then((response) => {
      isExist = false;
      response.forEach((file) => {
        if (file === id + ".json") {
          isExist = true;
        }
      });
      return isExist;
    })
    .catch((err) => {
      console.log(err);
    });
}
function isUserExist(user) {
  if (fs.existsSync(`./Server/src/db/users/${user}`)) return true;
  else {
    return false;
  }
}
async function addPokemonToUser(user, id) {
  let pokemon = await getPokemonFromApi(id);
  let isPokemon = await isPokemonExist(id, user);
  let isUser = await isUserExist(user);
  if (pokemon != {} && pokemon != null)
    if (isPokemon === false) {
      if (isUser === true) {
        let pokemon = await getPokemonFromApi(id);

        let obj = {
          pokemons: [],
        };
        obj.pokemons.push(pokemon);
        let jsonString = JSON.stringify(obj);
        fs.writeFile(
          `./Server/src/db/users/${user}/${id}.json`,
          jsonString,
          "utf8",
          function (err) {
            if (err) throw err;
          }
        );
        return true;
      } else {
        throw new UserDoesNotExist();
      }
    } else {
      throw new UserAlreadyHavePokemon();
    }
  else {
    throw new NotFoundPokemons();
  }
}
async function deletePokemonFromUser(user, id) {
  let isPokemon = await isPokemonExist(id, user);
  let isUser = await isUserExist(user);
  if (isPokemon === true) {
    if (isUser === true) {
      fs.unlink(`./Server/src/db/users/${user}/${id}.json`, function (err) {
        if (err) throw err;
      });
      return true;
    } else {
      throw new UserDoesNotExist();
    }
  } else {
    throw new UserDoesNotHavePokemon();
  }
}
function getPokemonListFromUser(user) {
  return fs.promises
    .readdir(`./Server/src/db/users/${user}`)
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
    });
}
module.exports = router;
