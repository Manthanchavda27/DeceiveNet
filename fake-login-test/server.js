const express = require("express");
const { DeceiveNet } = require("deceivenet-sdk");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    DeceiveNet({
        projectId: "YOUR_PROJECT_ID",
        token: "YOUR_API_KEY",

        endpoint: "http://localhost:3000/api/sdk/events",

        interceptRoutes: [
            "/login",
            "/admin",
            "/wp-admin"
        ],

        debug: true
    })
);

// Fake Login Page
app.get("/login", (req, res) => {

    res.send(`
    <h1>Admin Login</h1>

    <form method="POST" action="/login">

      <input
        name="username"
        placeholder="Username"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
      />

      <button type="submit">
        Login
      </button>

    </form>
  `);
});

// Fake Login Handler
app.post("/login", (req, res) => {

    console.log("Captured Login:", req.body);

    res.send("Invalid credentials");
});

app.listen(8080, () => {

    console.log(
        "Fake honeypot running at:"
    );

    console.log(
        "http://localhost:8080/login"
    );
});