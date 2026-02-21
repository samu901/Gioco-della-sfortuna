// imports
import express from 'express';
import morgan from 'morgan';
import { check, validationResult } from 'express-validator';
import cors from 'cors';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';
import dayjs from 'dayjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getUser } from './dao/userDAO.mjs';
import { getCardById, getRandomCard } from './dao/cardsDAO.mjs';
import { addMatch, getMatches } from './dao/matchDAO.mjs';
import { Card, Match } from './models/Models.mjs'; 
import { ConflictError, InternalServerError, NotFoundError, UnauthorizedError, UnprocessableEntityError } from './models/errors/AppErrors.mjs';

// init express
const app = new express();
const port = 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// middlewares
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/public/')));
app.use(morgan('dev'));
app.use(cors({origin: 'http://localhost:5173', optionsSuccessStatus: 200, credentials: true, cookie: { httpOnly: true }}));

passport.use(new LocalStrategy(async function verify(username, password, cb){
  if(!username || username.length<4 || !password || password.length<6) return cb(null, false, "Username e/o password errati");
  const user = await getUser(username, password);
  if(!user) return cb(null, false, "Username e/o password errati");
  else return cb(null, user);
}));

passport.serializeUser(function(user, cb){
  cb(null, user);
});

passport.deserializeUser(function(user, cb){
  return cb(null, user);
});

const isLogged = (req, res, next) => {
  if(req.isAuthenticated()) return next();
  else return res.status(401).json(new UnauthorizedError('you are not logged.'));
}

const isPlaying = (req, res, next) => {
  if(req.session.cards && req.session.cards.length>0) next();
  else return res.status(404).json(new NotFoundError('you are not playing any match.'));
}

app.use(session({secret: 'secret', resave: false, saveUninitialized: false, cookie: {httpOnly: true}}));
app.use(passport.authenticate('session'));


// routes

// POST /api/sessions
app.post('/api/sessions', passport.authenticate('local'), function(req, res){
  return res.status(201).json(req.user);
});

// GET /api/sessions/current
app.get('/api/sessions/current', isLogged, (req, res) => {
  return res.status(200).json({username: req.user.username});
});

// DELETE /api/sessions/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => res.end());
});


// GET /api/cards/:id
app.get('/api/cards/:id', async (req, res) => {
  try{
    const card = await getCardById(req.params.id);
    if(!card) return res.status(404).json(new NotFoundError('the card you are looking for does not exists'));
    return res.status(200).json(card);
  }catch(error){
    return res.status(500).json(new InternalServerError('an unpredictable error occurred'));
  }
});

// POST /api/cards/draw
app.post('/api/cards/draw', isLogged, isPlaying, async (req, res) => {
  if(req.session.cards[req.session.cards.length-1].possessed === undefined) return res.status(409).json(new ConflictError('you can\'t generate another card at the moment.'))
  const won = req.session.cards.filter(card => card.possessed === true);
  const lost = req.session.cards.filter(card => card.possessed === false);
  if(won.length===6 || lost.length === 3) return res.status(409).json(new ConflictError('The match is already finished.'));
  try{
    const card = await getRandomCard(req.session.cards.map(card => card.id));
    if(!card) return res.status(404).json(new NotFoundError('There are no cards available.'));
    req.session.cards.push({id: card.id, timestamp: dayjs().unix()});
    return res.status(200).json(card);
  }catch(error){
    return res.status(500).json(new InternalServerError('an unpredictable error occurred'));
  }
});

// POST /api/matches/init
app.post('/api/matches/init', async (req, res) => {
  try{
    req.session.cards = [];
    for(let i=0;i<3;i++){
      const card = await getRandomCard(req.session.cards.map(card => card.id), true);
      if(!card) return res.status(404).json(new NotFoundError('There are no cards available.'));
      req.session.cards.push({...card, timestamp: dayjs().unix(), possessed: true});
    }
    req.session.cards.push({...(await getRandomCard(req.session.cards.map(card => card.id))), timestamp: dayjs().unix()});
    const object = req.session.cards.map(card => {
      const obj = {...card};
      delete obj.timestamp;
      delete obj.possessed;
      return obj;
    });
    return res.status(200).json(object);
  }catch(error){
    return res.status(500).json(new InternalServerError('an unpredictable error occurred.'));
  }
});

app.post('/api/matches/current/verify', isPlaying, [check('index').isNumeric()] , async (req, res) => {
  if(!validationResult(req).isEmpty()) return res.status(422).json(new UnprocessableEntityError('index is not numeric'));
  try{
    const sessionCard = req.session.cards[req.session.cards.length-1];
    if(sessionCard.possessed !== undefined) return res.status(409).json(new ConflictError('you had already verified the card.'));
    const dbCard = await getCardById(sessionCard.id);
    if(!dbCard) return res.status(404).json(new NotFoundError('the card you are looking for is not available.'));
    const sorted = [...req.session.cards.filter(card => card.possessed === true)];
    sorted.push(dbCard)
    sorted.sort((c1, c2) => c1.misfortune-c2.misfortune);
    let index = req.body.index;
    if(index < 0) index = 0;
    else if(index >= req.session.cards.length) index = req.session.cards.length-1;
    if(sorted[index].misfortune===dbCard.misfortune && (dayjs().unix()-sessionCard.timestamp)<=30){
      req.session.cards[req.session.cards.length-1].possessed = true;
      req.session.cards[req.session.cards.length-1].misfortune = dbCard.misfortune;
      if(!req.isAuthenticated()) req.session.cards = undefined;
      return res.status(200).json({success: true});
    }else{
      req.session.cards[req.session.cards.length-1].possessed = false;
      if(!req.isAuthenticated()) req.session.cards = undefined;
      return res.status(200).json({success: false});
    }
  }catch(error){
    return res.status(500).json(new InternalServerError('an unpredictable error occurred.'));
  }
});

// POST /api/matches
app.post('/api/matches', isLogged, isPlaying, async (req, res) => {
  try{
    await addMatch(req.user.id, req.session.cards);
    req.session.cards = undefined;
    return res.status(201).end();
  }catch(error){
    return res.status(500).json(new InternalServerError('an unpredictable error occurred.'));
  }
});

// GET /api/matches
app.get('/api/matches', isLogged, async (req, res) => {
  try{
    const matches = await getMatches(req.user.id);
    const response = [];
    for(const match of matches){
      const cards = [];
      for(const card of match){
        const c = new Card(card.CardID, card.name);
        [c.round, c.possessed] = [card.round, card.possessed];
        cards.push(c);
      }
      response.push(new Match(match[0].MatchID, match[0].win, match[0].date, cards));
    }
    return res.status(200).json(response);
  }catch(error){
    return res.status(500).json(new InternalServerError('an unpredictable error occurred.'));
  }
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});