const express = require("express");
const { Snippet } = require("../models/snippet");
const router = express.Router();

//find all snippets from a user
router.get("/", async (req, res) => {
  //find all snippets that have user = to the current logged user
  const snippetsList = await Snippet.find({ user: req.payload.userId });

  if (!snippetsList) res.status(404).json({ success: false });
  res.status(200).send(snippetsList);
});

//sort user snippets by tag
router.get("/:tag", async (req, res) => {
  const filteredSnippetList = await Snippet.find({
    tag: req.params.tag,
    user: req.payload.userId,
  });

  if (!filteredSnippetList) res.status(404).json({ success: false });
  res.status(200).send(filteredSnippetList);
});

//create snippet
router.post("/", async (req, res) => {
  let snippet = new Snippet({
    title: req.body.title,
    description: req.body.description,
    code: req.body.code,
    tag: req.body.tag,

    //add the user id to the snippet
    user: req.payload.userId,
  });
  snippet = await snippet.save();

  if (!snippet) res.status(500).send("The snippet cannot be created!");
  console.log(req.payload);
  res.send(snippet);
});

//update snippet
router.put("/:id", async (req, res) => {
  const snippet = await Snippet.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      code: req.body.code,
      tag: req.body.tag,
    },
    { new: true } // get back the new data updated
  );
  if (!snippet) return res.status(404).send("the snippet cannot be updated!");
  res.send(snippet);
});

//delete snippet
router.delete("/:id", (req, res) => {
  Snippet.findByIdAndDelete(req.params.id)
    .then((snippet) => {
      if (snippet) {
        return res
          .status(200)
          .json({ success: true, message: "The snippet is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "snippet not found!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

module.exports = router;
