const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  avatar: {
    type: String
  },
  // action: [
  //   {
  //     user: {
  //       type: Schema.Types.ObjectId,
  //       ref: "user"
  //     },
  //     type: {
  //       type: Schema.Types.String,
  //       enum: ['like', 'dislike'],
  //     },
  //   }
  // ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  dislikes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    }
  ],
  comments: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "user"
      },
      text: {
        type: String,
        required: true
      },
      name: {
        type: String
      },
      avatar: {
        type: String
      },
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = Post = mongoose.model("post", PostSchema);
