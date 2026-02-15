import ejsRouter from './ejsRouter.js';
import citationRouter from './citation/citationRouter.js';
import personRouter from './person/personRouter.js';
import featuredQuoteRouter from './misc/featuredQuoteRouter.js';
import notationRouter from './notation/notationRouter.js';
import requireAdmin from './session/requireAdmin.js';
import sessionRouter from './session/sessionRouter.js';
import sourceRouter from './source/sourceRouter.js';
import storyRouter from './story/storyRouter.js';
import tagRouter from './tag/tagRouter.js';
import userRouter from './user/userRouter.js';

export default function registerRouters(app) {
  app.use('/session', sessionRouter);

  app.use('/citations', citationRouter);
  app.use('/featured-quotes', featuredQuoteRouter);
  app.use('/notations', requireAdmin, notationRouter);
  app.use('/people', personRouter);
  app.use('/sources', sourceRouter);
  app.use('/stories', storyRouter);
  app.use('/tags', requireAdmin, tagRouter);
  app.use('/users', requireAdmin, userRouter);

  app.use('/', requireAdmin, ejsRouter);
}