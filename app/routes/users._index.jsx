// Loader function that return all users via mongoose and returns it tp the client
// implement the component that will display a list of the users


import { json } from "@remix-run/node";
import mongoose from "mongoose";
import React from "react";

export async function loader() {

    const users = await mongoose.models.User.find();
    return json({ users });
    }

export default function Users({ users }) {
    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user._id}>{user.name}</li>
                ))}
            </ul>
        </div>
    );
}


