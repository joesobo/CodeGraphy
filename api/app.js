import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { dirIt } from "./utils/dirIt.js";
import { findConnections } from "./utils/connections.js";

const app = express();
app.use(bodyParser.json());
app.use(cors());

let currentPath = "";
let currentDir = "";
let removeDir = "";
let files = [];
let allConnections = [];

app.post("/", async (req, res) => {
  currentPath = req.body.url;
  currentDir = req.body.dir;
  removeDir = currentPath.replace(currentDir, "").substring(1);
  files = [];
  files = dirIt(currentPath);

  async function getConnections() {
    for (const file of files) {
      const result = await findConnections(file, removeDir);
      if (result.length > 0) {
        allConnections.push(result);
      }
    }
  }

  allConnections = [];
  await getConnections();
});

app.get("/", (req, res) => {
  res.send({ path: currentPath, files: files, connections: allConnections });
});

app.listen(8081, () => {
  console.log("App's running on port 8081");
});
