import express from "express";
import Game from "../models/gameModel.js";
import Joi from "joi";
const router = express.Router();

const schemaGame = Joi.object({
  id: Joi.number().integer(),
  name: Joi.string().min(1).required(),
  slug_id: Joi.number().required(),
});

router
  .get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const game = await Game.getOneById(id);

      res.json(game);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

  .get("/", async (req, res) => {
    try {
      const game = await Game.getAll();

      res.json(game);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

  .put("/:id", async (req, res) => {
    const game = {
      id: req.params.id,
      name: req.body.name,
      slug_id: req.body.slug_id,
    };

    try {
      const { error, value } = await schemaGame.validate(game);
      const gameUpdate = await Game.updateGame(value);
      if (gameUpdate) res.json(game);
      else res.status(422).json({ message: error.message });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  })

  .post("/", async (req, res) => {
    const game = {
      name: req.body.name,
      slug_id: req.body.slug_id,
    };
    try {
      const { error, value } = await schemaGame.validate(game);
      const gameCreate = await Game.createNew(value);

      if (gameCreate) {
        const newGame = await Game.getOneById(gameCreate);
        res.json(newGame);
      } else res.status(422).json({ message: error.message });
    } catch (err) {
      res.json({ message: err.message }).status(500);
    }
  })

  .delete("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const gameDelete = await Game.deleteById(id);
      if (gameDelete) {
        res.json(`Le jeux ${id} a bien été effacée`);
      } else {
        res.status(422).json(`Une erreur est survenue lors de la suppression`);
      }
    } catch (error) {
      res.status(500).json(`Erreur serveur`);
    }
    return res.status(201).end();
  });

export default router;
