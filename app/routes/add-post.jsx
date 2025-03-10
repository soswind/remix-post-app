import { redirect } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";
import mongoose from "mongoose";
import { useState } from "react";
import { authenticator } from "../services/auth.server";

export async function loader({ request }) {
  // Sørg for, at brugeren er godkendt, ellers omdiriger til login-siden
  await authenticator.isAuthenticated(request, 
    { failureRedirect: "/signin" });
  return {};
  
  // Loaderen behøver ikke returnere noget, da dens formål primært er at sikre, at brugeren er godkendt
}

export const meta = () => {
  return [{ title: "Remix Post App - Add New Post" }];
};
export default function AddPost() {
  const [image, setImage] = useState("https://placehold.co/600x400?text=Add+your+amazing+image");
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="page">
      <h1>Tilføj Post</h1>
      <Form id="post-form" method="post">
        <label htmlFor="caption">Caption</label>
        <input id="caption" name="caption" type="text" aria-label="caption" placeholder="Indtast en caption..." />

        <label htmlFor="image">Billede URL</label>
        <input name="image" type="url" onChange={e => setImage(e.target.value)} placeholder="Indtast billede URL..." />

        <label htmlFor="image-preview">Preview</label>
        <img
          id="image-preview"
          className="image-preview"
          src={image ? image : "https://placehold.co/600x400?text=Paste+an+image+URL"}
          alt="Choose"
          onError={e => (e.target.src = "https://placehold.co/600x400?text=Error+loading+image")}
        />

        <div className="btns">
          <button>Gem</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Annuller
          </button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const user = await authenticator.isAuthenticated(request, {
     failureRedirect: "/signin" });


     
    

  const formData = await request.formData();
  const post = Object.fromEntries(formData);

  post.user = user._id;

  await mongoose.models.Post.create(post);

  return redirect("/posts");
}
