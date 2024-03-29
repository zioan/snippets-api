const express = require("express");
const { SnippetTag } = require("../models/snippetTag");
const router = express.Router();

//find all snippetTag from a user
router.get("/", async (req, res) => {
  const snippetTagList = await SnippetTag.find({ user: req.payload.userId });

  if (!snippetTagList) res.status(404).json({ success: false });
  res.status(200).send(snippetTagList);
});

//sort user snippetTag by tag
router.get("/:tag", async (req, res) => {
  const filteredSnippetTagList = await SnippetTag.find({
    tag: req.params.tag,
    user: req.payload.userId,
  });

  if (!filteredSnippetTagList) res.status(404).json({ success: false });
  res.status(200).send(filteredSnippetTagList);
});

//create snippetTag
router.post("/", async (req, res) => {
  let snippetTag = new SnippetTag({
    title: req.body.title,
    user: req.payload.userId,
  });
  snippetTag = await snippetTag.save();

  if (!snippetTag) res.status(500).send("The snippet cannot be created!");
  console.log(req.payload);
  res.send(snippetTag);
});

//update snippetTag
router.put("/:id", async (req, res) => {
  const snippetTag = await SnippetTag.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
    },
    { new: true } // get back the new data updated
  );
  if (!snippetTag)
    return res.status(404).send("the snippetTag cannot be updated!");
  res.send(snippetTag);
});

//delete snippetTag
router.delete("/:id", (req, res) => {
  SnippetTag.findByIdAndDelete(req.params.id)
    .then((snippetTag) => {
      if (snippetTag) {
        return res
          .status(200)
          .json({ success: true, message: "The snippetTag is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "snippetTag not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
