// app/services/session.server.jsx

import { createCookieSessionStorage } from "@remix-run/node";

// export the whole sessionStorage

export let sessionStorage = createCookieSessionStorage({
    cookie: {
        name: "_session", // use any name you want
        sameSite: "lax", // this helps with CSRF
        path: "/", // remember to add this so the cookie will work in all routes
        httpOnly: true, // for security reasons, make this cookie http only
        secrets: ["s3cr3t"], // replace this with an actual secret
        secure: process.env.NODE_ENV === "production", // enable this in prod only
    },
});

// you can also export the methods individually for your own usage
// session storage is used to store information about the user
// across multiple requests

export let { getSession, commitSession, destroySession } = sessionStorage;