import express from "express";
import { register } from "../controller/register";
import { login } from "../controller/login";
import { generateURL, validateURL } from "../controller/generate-url";
import {
  addCredentials,
  getCredentials,
  getPlatformCredentials,
} from "../controller/credentials";
import { getAllUsers, getUser } from "../controller/users";

const router = express.Router();

router.post("/api/register", register);
router.get("/api/login", login);
router.get("/api/generate-url", generateURL);
router.get("/api/validate-url", validateURL);
router.get("/api/get-all-credentials", getCredentials);
router.post("/api/save-credentials", addCredentials);
router.get("/api/get-credentials", getPlatformCredentials);
router.get("/api/get-all-users", getAllUsers);
router.get("/api/get-user", getUser);

export default router;
