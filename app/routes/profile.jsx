import { Form, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";


export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
  return user;
}

export default function Profile() {
  const user = useLoaderData();

  return (
    <div className="page">
      <h1>Profile</h1>
      <p>Mail: {user.mail}</p>
      <p>Name: {user.name}</p>
      <p>Title: {user.title}</p>
      <Form method="post">
        <button>Logout</button>
      </Form>
    </div>
  );
}




export async function action({ request }) {
  await authenticator.logout(request, 
    { redirectTo: "/signin" });
}