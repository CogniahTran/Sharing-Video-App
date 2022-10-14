import express from "express";
import { verifyToken } from "../verifyToken.js";
import { addVideo, addView, deleteVideo, getVideo, random, sub, trend, updateVideo, getByTag, searching } from "../controllers/video.js";

const router = express.Router();

// create a video
router.post("/", verifyToken, addVideo);
// update a video
router.put("/:id", verifyToken, updateVideo);
// delete a video
router.delete("/:id", verifyToken, deleteVideo);
// find a video
router.get("/find/:id", getVideo);
// views of a video
router.put("/view/:id", addView);
// trending videos
router.get("/trend", trend);
// subcribe video
router.get("/sub", verifyToken, sub);
// random video on home page
router.get("/random", random);
// find video by its tag
router.get("/tag", getByTag);
//search a video
router.get("/search", searching);

export default router;