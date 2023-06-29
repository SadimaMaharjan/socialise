const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
// import moment module to format the timestamp
const moment = require("moment");

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) =>
        moment(createdAtVal).format("MMM DD, YYYY [at] hh:mm a"),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

//Create a virtual property called 'reactionCount' that returns the length of the thought's reactions array field on query.

thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

//Initialise Thought model
const Thought = model("thought", thoughtSchema);
module.exports = Thought;
