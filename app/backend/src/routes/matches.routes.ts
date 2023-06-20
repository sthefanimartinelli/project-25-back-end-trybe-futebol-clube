import { Request, Router, Response } from 'express';
import MatchController from '../controllers/MatchController';

const matchController = new MatchController();

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { inProgress } = req.query;
  if (!inProgress) {
    return matchController.getAllMatches(req, res);
  }
  if (inProgress === 'true') {
    console.log('Hello');
    return matchController.getMatchesInProgress(req, res);
  }
  return matchController.getMatchesFinished(req, res);
});
// router.get('/', (req: Request, res: Response) => );

export default router;
