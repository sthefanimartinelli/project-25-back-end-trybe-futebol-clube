import { Request, Router, Response } from 'express';
import MatchController from '../controllers/MatchController';

const matchController = new MatchController();

const router = Router();

router.get('/home', (req: Request, res: Response) => matchController.getLeaderboard(req, res));

export default router;
