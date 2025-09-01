import { Router } from 'express';

const router = Router();

// Placeholder routes for Phase 3
router.get('/', (req, res) => {
  res.json({ message: 'Feedback routes - to be implemented in Phase 3' });
});

export { router as feedbackRoutes };
