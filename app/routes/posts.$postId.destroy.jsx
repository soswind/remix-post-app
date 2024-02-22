import { json, redirect } from "@remix-run/node";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server.jsx";

export async function loader({ request, params }) {
  // Sørg for, at brugeren er godkendt, ellers omdiriger til login-siden
  await authenticator.isAuthenticated(request,
     { failureRedirect: "/signin" });

  // Loaderen behøver ikke returnere noget, så du kan bare returnere en tom respons
  return {};
}

export async function action({ params }) {
  await authenticator.isAuthenticated(request, 
    { failureRedirect: "/signin" });

  // Slet den ønskede post
  await mongoose.models.Post.findByIdAndDelete(params.postId);

  // Omdiriger brugeren tilbage til listen over poster
  return redirect("/posts");
}

