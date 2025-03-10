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
      <h1>Din Profil</h1>
      <p>E-mail: {user.mail}</p>
      <p>Navn: {user.name}</p>
      <p>Titel: {user.title}</p>
      <Form method="post">
        <button>Log ud</button>
      </Form>
    </div>
  );
}




export async function action({ request }) {
  await authenticator.logout(request, 
    { redirectTo: "/signin" });
}