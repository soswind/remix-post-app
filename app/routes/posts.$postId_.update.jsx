import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import mongoose from "mongoose";
import { authenticator } from "../services/auth.server.jsx";

export function meta() {
  return [
    {
      title: "Remix Post App - Update"
    }
  ];
}

export async function loader({ request, params }) {
  // Sørg for, at brugeren er godkendt, ellers omdiriger til login-siden
  await authenticator.isAuthenticated(request, { failureRedirect: "/signin" });

  // Hent posten fra databasen og send den til brug i komponenten
  const post = await mongoose.models.Post.findById(params.postId).populate("user");
  
  // Returner posten som JSON-data
  return json({ post });
}



export default function UpdatePost() {
  const { post } = useLoaderData();
  const [image, setImage] = useState(post.image);
  const navigate = useNavigate();

  function handleCancel() {
    navigate(-1);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch(`/api/posts/${post._id}`, {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      navigate(`/posts/${post._id}`);
    }
  }

  return (
    <div className="page">
      <h1>Update Post</h1>
      <Form id="post-form" method="post" onSubmit={handleSubmit}>
        <label htmlFor="caption">Caption</label>
        <input
          id="caption"
          defaultValue={post.caption}
          name="caption"
          type="text"
          aria-label="caption"
          placeholder="Write a caption..."
        />
        <label htmlFor="image">Image URL</label>
        <input
          name="image"
          defaultValue={post.image}
          type="url"
          onChange={e => setImage(e.target.value)}
          placeholder="Paste an image URL..."
        />

        <label htmlFor="image-preview">Image Preview</label>
        <img
          id="image-preview"
          className="image-preview"
          src={image ? image : "https://placehold.co/600x400?text=Paste+an+image+URL"}
          alt="Choose"
          onError={e => (e.target.src = "https://placehold.co/600x400?text=Error+loading+image")}
        />

        <input name="uid" type="text" defaultValue={post.uid} hidden />
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

export async function action({ request, params }) {
  const authUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin"
  });
  
  const postToUpdate = await mongoose.models.Post.findById(params.postId);

  if (postToUpdate.user.toString() !== authUser._id.toString()) {
    return redirect(`/posts/${params.postId}`);
  }


  const formData = await request.formData();
  const post = Object.fromEntries(formData);

  postToUpdate.caption = post.caption;
  postToUpdate.image = post.image;
  await postToUpdate.save();


  return redirect(`/posts/${params.postId}`);
}
