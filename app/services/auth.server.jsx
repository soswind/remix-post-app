import { Authenticator, AuthorizationError } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator(sessionStorage, {
  sessionErrorKey: "sessionErrorKey" // keep in sync
});

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    let mail = form.get("mail");
    let password = form.get("password");
    let user = null;

    // do some validation, errors are in the sessionErrorKey
    if (!mail || mail?.length === 0) {
      throw new AuthorizationError("Fejl: Email er påkrævet.");
    }
    if (typeof mail !== "string") {
      throw new AuthorizationError("Fejl: Email skal være en streng.");
    }

    if (!password || password?.length === 0) {
      throw new AuthorizationError("Fejl: Password er påkrævet.");
    }
    if (typeof password !== "string") {
      throw new AuthorizationError("Fejl: Password skal være en streng.");
    }

    // the type of this user must match the type you pass to the Authenticator
    // the strategy will automatically inherit the type if you instantiate
    // directly inside the `use` method

    // login the user, this could be whatever process you want
    if (mail === "sos@mail.dk" && password === "123") {
      user = {
        mail
      };

      return user;
    } else {
      // if problem with user throw error AuthorizationError
      throw new AuthorizationError("Fejl: Bruger findes ikke. Prøv venligst igen.");
    }
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass"
);
  




