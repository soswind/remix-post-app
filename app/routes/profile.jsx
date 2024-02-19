import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";

export async function loader({ request }) {
  return await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
}

export default function Profile() {
  const user = useLoaderData();
  return (
    <div className="page">
      <h1>Profile</h1>
      <p>User: {user.mail}</p>
      <Form method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  await authenticator.logout(request, { redirectTo: "/signin" });
}