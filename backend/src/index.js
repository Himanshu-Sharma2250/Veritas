import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import db from "./utils/db.js";
import router from "./route/index.route.js";

dotenv.config({path: './.env'});

const app = express()
const port = process.env.PORT || 4000;

app.use(cors({
  origin:process.env.BASE_URL,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods:['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

db();

app.use("/api/v1/user", router);

app.get('/', (req, res) => {
  res.send('Hello World again2!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
