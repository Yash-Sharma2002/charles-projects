import express from "express";
import cors from "cors";
import path from "path";
import MainRouter from "./routes/route";
import dotenv from "dotenv";

dotenv.config({ path: "data.env" });

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(cors());
app.use("/", MainRouter);


// for deploying on heroku also move client from ../client to ./client also change api url from "http://localhost:8000" to nothin
// just remove that
// app.use(express.static(path.join(__dirname, "../../client", "build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../../client", "build", "index.html"));
// });

// for deploying on localhost
// app.use(express.static(path.join(__dirname, '../client', 'build')));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, '../client', 'build', 'index.html'));
// })

app.listen(PORT, () => console.log("Server is running at " + PORT));
