import { Router } from 'express';
import { getNewsFeed } from './helpers/getnewsfeed';

const router = Router();

//Simple 4 API endpoints, hence no sense in using a separate file for defining routers.
//It can be moved to file anytime whenever required.

//For getting news feed
router.post("/getNewsFeed",getNewsFeed);

export const myRouter = router;