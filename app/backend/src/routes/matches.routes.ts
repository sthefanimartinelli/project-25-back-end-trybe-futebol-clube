import { Request, Router, Response } from 'express';
import MatchController from '../controllers/MatchController';
import TokenValidation from '../middlewares/TokenValidation';

const { validateToken } = TokenValidation;

const matchController = new MatchController();

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const { inProgress } = req.query;
  if (!inProgress) {
    return matchController.getAllMatches(req, res);
  }
  if (inProgress === 'true') {
    return matchController.getMatchesInProgress(req, res);
  }
  return matchController.getMatchesFinished(req, res);
});

router.patch('/:id/finish', validateToken, (req: Request, res: Response) =>
  matchController.changeMatchStatus(req, res));

router.patch('/:id', validateToken, (req: Request, res: Response) =>
  matchController.updateMatch(req, res));

router.post('/', validateToken, (req: Request, res: Response) =>
  matchController.createMatch(req, res));

export default router;
