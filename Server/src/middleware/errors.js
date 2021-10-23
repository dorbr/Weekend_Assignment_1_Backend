class PokemonError extends Error {
  // parent error
  constructor() {
    super();
    this.name = this.constructor.name;

    if (this instanceof NotFoundPokemons) {
      this.type = "Pokemon Does Not Exist";
      this.statusCode = 404;
    } else if (this instanceof UserAlreadyHavePokemon) {
      this.type = "User Already Cought This Pokemon";
      this.statusCode = 403;
    } else if (this instanceof UserDoesNotHavePokemon) {
      this.type = "User Does Not Have This Pokemon";
      this.statusCode = 403;
    } else if (this instanceof ServerError) {
      this.type = "Server Error";
      this.statusCode = 500;
    } else if (this instanceof UserDoesNotExist) {
      this.type = "User Does Not Exist";
      this.statusCode = 401;
    }

    this.message = this.type; // detailed error message
  }
}

// extending to child error classes
class NotFoundPokemons extends PokemonError {}
class UserAlreadyHavePokemon extends PokemonError {}
class UserDoesNotHavePokemon extends PokemonError {}
class ServerError extends PokemonError {}
class UserDoesNotExist extends PokemonError {}

module.exports = {
  PokemonError,
  NotFoundPokemons,
  UserAlreadyHavePokemon,
  UserDoesNotHavePokemon,
  ServerError,
  UserDoesNotExist,
};
