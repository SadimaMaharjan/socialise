const { User, Thought } = require("../models");

module.exports = {
  // Get all thoughts

  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thought

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select("-__v");

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $addToSet: { thoughts: thought._id } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({
          message: "Thought created, but found no user with that ID",
        });
      }
      res.json("Created the thought successfully!");
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // delete a thought
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({
        _id: req.params.thoughtId,
      });

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      // Remove thought id from user's `thoughts` field
      const user = User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user with that thought" });
      }

      res.json({ message: "Thought deleted" });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  //update thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: "No thought with that ID" });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // add reaction

  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        {
          _id: req.params.thoughtId,
        },
        { $addToSet: { reactions: req.body } },
        { new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID :(" });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  //remove reaction

  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        {
          _id: req.params.thoughtId,
        },
        { $pull: { reactions: { reactionId: req.params.reactionId } } }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought found with that ID :(" });
      }

      res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
};
