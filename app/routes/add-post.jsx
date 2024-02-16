import { redirect } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";
import mongoose from "mongoose";
import { useState } from "react";

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
      <h1>Add a Post</h1>
      <Form id="post-form" method="post">
        <label htmlFor="caption">Caption</label>
        <input id="caption" name="caption" type="text" aria-label="caption" placeholder="Write a caption..." />

        <label htmlFor="image">Image URL</label>
        <input name="image" type="url" onChange={e => setImage(e.target.value)} placeholder="Paste an image URL..." />

        <label htmlFor="image-preview">Image Preview</label>
        <img
          id="image-preview"
          className="image-preview"
          src={image ? image : "https://placehold.co/600x400?text=Paste+an+image+URL"}
          alt="Choose"
          onError={e => (e.target.src = "https://placehold.co/600x400?text=Error+loading+image")}
        />

        <div className="btns">
          <button>Save</button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const post = Object.fromEntries(formData);
  await mongoose.models.Post.create(post);

  return redirect("/posts");
}
