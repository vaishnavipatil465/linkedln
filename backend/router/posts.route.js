const router = require('express').Router();
const { Post, Comment, Reply } = require('../models');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const { Validator } = require('node-input-validator');
//create post
router.post('/create-post', async (req, res) => {
  try {
    const v = new Validator(req.body, {
      title: 'required',
      body: 'required',
      posted_by: 'required'
    });

    const matched = await v.check();
    if (!matched) {
      return res.status(422).send(v.errors);
    }

    let newPostDocument = new Post(req.body);
    let postData = await newPostDocument.save();
    if (postData) {
      return res.status(200).json({ message: "post created success!", data: postData })
    }
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      data: err
    })
  }
})

router.put('/like-post', async (req, res) => {
  try {
    const v = new Validator(req.body, {
      post_id: 'required'
    });

    const matched = await v.check();
    if (!matched) {
      return res.status(422).send(v.errors);
    }
    req.user = { _id: "6162ca236a540e2144b1682b" };
    let ack = await Post.findByIdAndUpdate(req.body.post_id, { $addToSet: { likes: req.user._id } }, { new: true }).exec();
    if (!ack) {
      return res.status(404).json({ message: "given post not found", data: ack });
    }
    return res.status(200).json({ data: ack });
  } catch (error) {
    return res.status(400).json({ message: error.message, data: err });
  }
})

router.put('/unlike-post', async (req, res) => {
  try {
    const v = new Validator(req.body, {
      post_id: 'required'
    });

    const matched = await v.check();
    if (!matched) {
      return res.status(422).send(v.errors);
    }
    req.user = { _id: "6162ca236a540e2144b1682b" };
    let ack = await Post.findByIdAndUpdate(req.body.post_id, { $pull: { likes: req.user._id } }, { new: true }).exec();
    if (!ack) {
      return res.status(404).json({ message: "given post not found", data: ack });
    }
    return res.status(200).json({ data: ack });
  } catch (error) {
    return res.status(400).json({ message: error.message, data: err });
  }
});

// will return the count of likes, comments with comments content
router.get('/:post_id/details', async (req, res) => {
  let { post_id } = req.params;
  if (!ObjectId.isValid(post_id)) {
    return res.status(400).json({ message: "Invalid post id", data: {} })
  }
  try {
    let fetchedPost = await Post.findById(post_id);
    if (!fetchedPost) {
      return res.status(400).json({ message: "Post not found", data: {} })
    }
    let query = [
      {
        "$lookup": {
          "from": "comments",
          "localField": "comments",
          "foreignField": "_id",
          "as": "post_comments"
        }
      },
      {
        "$match": { "_id": ObjectId(post_id) }
      },
      {
        "$project": {
          title: 1,
          "post_comments.comment": 1,
          "post_comments.createdAt": 1,
          body: 1, image: 1, posted_by: 1, createdAt: 1, updatedAt: 1,
          likes_count: { "$size": "$likes" }, comments_count: { "$size": "$comments" }
        }
      }
    ];

    let result = await Post.aggregate(query)
    let meta = await Post.findById(post_id)
    .populate('comments',['comment', 'createdAt'])
    
    return res.status(200).json({ message: "Post Details Fetched Success!", data: {result,meta} })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      data: err
    })
  }
})


router.get('/post-list', async (req, res) => {
  try {
    let query = [
      {
        $project: {
          title: 1, body: 1, image: 1, posted_by: 1, createdAt: 1, likes:1,
          comment_count: { $size: "$comments" },
          likes_count: { $size: "$likes" }
        }
      }
    ];
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let recordsPerPage = req.query.recordsPerPage ? parseInt(req.query.recordsPerPage) : 5;
    let skip = (page - 1) * recordsPerPage;
    let total = await Post.countDocuments(query);
    query.push({ $skip: skip });
    query.push({ $limit: recordsPerPage });
    let result = await Post.aggregate(query);
    return res.status(200).json({
      message: "Post List", data: {
        posts: result,
        meta: {
          total,
          currentPage: page,
          recordsPerPage,
          totalPages: Math.ceil(total/page)
      }
      }
    })
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      data: err
    })
  }
});


module.exports = router;
