import { Form, useLoaderData, NavLink } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { sessionStorage } from "../services/session.server";
import { authenticator } from "../services/auth.server";
import mongoose from "mongoose";

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

  return json({ error }, { headers }); // return the error message
}

export default function SignUp() {
  // if i got an error it will come back with the loader dxata
  const loaderData = useLoaderData();
  console.log("error", loaderData?.error);

  return (
    <div id="sign-up-page" className="page">
      <h1>Sign Up</h1>
      <Form id="sign-up-form" method="post">
        <label htmlFor="mail">Mail</label>
        <input
          id="mail"
          type="email"
          name="mail"
          aria-label="mail"
          placeholder="Type your mail..."
          required
          autoComplete="off"
        />

        <label htmlFor="password">Password</label>

        <input
          id="password"
          type="password"
          name="password"
          aria-label="password"
          placeholder="Type your password..."
          autoComplete="current-password"
        />
        <div className="btns">
          <button>Sign Up</button>
        </div>

        {loaderData?.error ? (
          <div className="error-message">
            <p>{loaderData?.error?.message}</p>
          </div>
        ) : null}
      </Form>
      <p>
        Already have an account? <NavLink to="/signin">Sign in here.</NavLink>
      </p>
    </div>
  );
}


export async function action({ request }) {
  const formData = await request.formData(); // get the form data
  const newUser = Object.fromEntries(formData); // convert the form data to an object
  const result = await mongoose.models.User.create(newUser); // create the user

  if (result) {
    return redirect("/signin");
  } else {
  return redirect("/signup");
}
}


