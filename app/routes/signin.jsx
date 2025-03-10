import { Form, useLoaderData, NavLink } from "@remix-run/react";
import { json } from "@remix-run/node";
import { sessionStorage } from "../services/session.server";
import { authenticator } from "../services/auth.server";


export async function loader({ request }) {
  // If the user is already authenticated redirect to /posts directly
  await authenticator.isAuthenticated(request, {
    successRedirect: "/posts"
  });
  // Retrieve error message from session if present
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  // Get the error message from the session
  const error = session.get("sessionErrorKey");

  session.unset("sessionErrorKey");
  
  const headers = new Headers({
    "Set-Cookie": await sessionStorage.commitSession(session),
  });

  return json({ error }, { headers}); // return the error message
}

export default function SignIn() {
    // if i got an error it will come back with the loader dxata
    const loaderData = useLoaderData();
    console.log("error", loaderData?.error);

    return (
      <div id="sign-in-page" className="page">
        <h1>Log ind</h1>
        <Form id="sign-in-form" method="post">
          <label htmlFor="mail">Mail</label>
          <input id="mail" type="email" name="mail" aria-label="mail" placeholder="Indtast din mail..." required />
  
          <label htmlFor="password">Adgangskode</label>
          <input
            id="password"
            type="password"
            name="password"
            aria-label="password"
            placeholder="Indtast din adgangskode..."
            autoComplete="current-password"
          />
          <div className="btns">
            <button>Log ind</button>
          </div>
  
          {loaderData?.error ? (
            <div className="error-message">
              <p>{loaderData?.error?.message}</p>
            </div>
          ) : null}
        </Form>
        <p>
          Har du ingen konto? <NavLink to="/signup">Tilmeld dig her.</NavLink>
        </p>
      </div>
    );
  }

export async function action({ request }) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/posts",
    failureRedirect: "/signin"
  });
}
