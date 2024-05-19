import express from "express";
import cors from "cors";
import router from "./routes/route";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use("/", router);


// for deploying on heroku also move client from ../client to ./client also change api url from "http://localhost:8000" to nothin
// just remove that
app.use(express.static(path.join(__dirname, "../../client", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../client", "build", "index.html"));
});

// for deploying on localhost
// app.use(express.static(path.join(__dirname, '../client', 'build')));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
// })

app.listen(PORT, () => console.log("Server is running at " + PORT));
