import express, { application } from 'express'
import path from 'path'
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));


const app = express()
const PORT = process.env.PORT || 80

// for deploying on heroku also move client from ../client to ./client also change api url from "http://localhost:8000" to nothin 
// just remove that 
app.use(express.static(path.join(__dirname , 'build')));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,  'build', 'index.html'));
  })


app.listen(PORT, () => console.log('Server is running at ' + PORT))