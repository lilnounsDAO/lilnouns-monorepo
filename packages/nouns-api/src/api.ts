import express, { Express, Request } from 'express';
import { param, validationResult } from 'express-validator';
import { generateNonce, ErrorTypes, SiweMessage } from 'siwe';
import Session from 'express-session';
import { getTokenMetadata, hasNounToken } from './utils';
import faunadb, {
  Documents,
  Paginate,
  Collection,
  Map,
  Lambda,
  Get,
  Create,
} from 'faunadb';

const cors = require('cors');

const serverClient = new faunadb.Client({ secret: 'ASK_ME_FOR_THIS :)', domain: "db.us.fauna.com" });

/**
 * Create the express app and attach routes
 */
export const createAPI = (): Express => {
  const app = express();

  app.use(express.json());
  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }))

  app.use(Session({
    name: 'lil-nouns-siwe',
    secret: "lil-nouns-siwe-secret",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: true }
  }));

  app.get('/', (_req, res) => {
    res.status(200).send({
      message: 'Nouns API Root',
    });
  });

  app.get(
    '/metadata/:tokenId',
    param('tokenId').isInt({ min: 0, max: 1000 }),
    async (req: Request, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ errors: errors.array() });
      }

      const metadata = await getTokenMetadata(req.params.tokenId);
      if (!metadata) {
        return res.status(500).send({ error: 'Failed to fetch token metadata' });
      }

      res.send(metadata);
    },
  );

  /* CRUD Idea endpoints */
  app.get(
    '/ideas',
    async (req: Request, res) => {
      try {
        const ideas = await serverClient.query(
          Map(
            Paginate(Documents(Collection("Ideas"))),
            Lambda(x => Get(x))
          )
        )

        res.status(200).json(ideas)
      } catch (error: any) {
        res.status(500).json({error: error.description})
      }
    },
  );

  app.post(
    '/ideas',
    async (req: Request, res) => {
      if (!req.session.siwe) {
        res.status(401).json({ message: 'You have to first sign in', type: 'UNAUTHENTICATED' });
        return;
      }

      // Not working, not sure why
      if (!hasNounToken(req.session.siwe.address)) {
        res.status(401).json({
          message: `User does not have a noun`,
        });
        return;
      }

      try {
        const properties = req.body.data
        const data = {
          ...properties,
          created_by: req.session.siwe.address,
          upvotes: [],
          downvotes: [],
        }

        // Create new idea
        await serverClient.query(
          Create(
            Collection('Ideas'),
            { data }
          )
        )

        // Fetch all ideas
        const ideas = await serverClient.query(
          Map(
            Paginate(Documents(Collection("Ideas"))),
            Lambda(x => Get(x))
          )
        )

        res.status(200).json(ideas)
      } catch (error: any) {
        res.status(500).json({error: error.description})
      }
  });

  /* CRUD Idea endpoints */


  /* Auth endpoints */

  app.get('/nonce', async function (req: Request, res) {
    req.session.nonce = generateNonce();
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(req.session.nonce);
  });

  app.get('/session', function (req, res) {
    if (!req.session.siwe) {
      res.status(401).json({ message: 'You have to first sign in', type: 'UNAUTHENTICATED' });
      return;
    }
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).json({
      message: `You are authenticated and your address is: ${req.session.siwe.address}`,
      type: "AUTHENTICATED",
    }).end();
  });

  app.post('/auth', async function (req: Request, res) {
    try {
      if (!req.body.message) {
        res.status(422).json({ message: 'Expected prepareMessage object as body.' });
        return;
      }

      const message = new SiweMessage(req.body.message);
      const fields = await message.validate(req.body.signature) as any;

      if (fields.nonce !== req.session.nonce) {
        console.log(req.session);
        res.status(422).json({
            message: `Invalid nonce.`,
        });
        return;
      }
      // Once we validate their signature, check if the user has lil nouns.

      // Not working but we only want to authenticate their session if they have a lil noun
      if (!hasNounToken(fields.address)) {
        res.status(401).json({
          message: `User does not have a noun`,
        });
        return;
      }

      // Once we confirm the user has lil nouns create the session.
      req.session.siwe = fields;
      const now = new Date();
      const sixtyMinsFromNow = new Date(now.getTime() + 60*60000);
      req.session.cookie.expires = fields.expirationTime || sixtyMinsFromNow;

      req.session.save(() => res.status(200).json({
        message: 'Successfully signed in',
        type: "SIGN_IN_SUCCESS",
    }).end());
    } catch (e: any) {
      req.session.siwe = undefined;
      req.session.nonce = undefined;
      console.error(e);
      switch (e) {
        case ErrorTypes.EXPIRED_MESSAGE: {
          req.session.save(() => res.status(440).json({ message: e.message }));
          break;
        }
        case ErrorTypes.INVALID_SIGNATURE: {
          req.session.save(() => res.status(422).json({ message: e.message }));
          break;
        }
        default: {
          req.session.save(() => res.status(500).json({ message: e.message }));
          break;
        }
      }
    }
  });

  /* Auth endpoints */

  return app;
};
