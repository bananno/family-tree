import SourceModel from './Source.model.js';

export default async function updateSourceRoute(req, res) {
  const source = await SourceModel.findById(req.params.id);

  if (!source) {
    return res.status(404).send();
  }

  if (req.body.useMarkdown !== undefined) {
    source.useMarkdown = req.body.useMarkdown;
  }

  if (req.body.content !== undefined) {
    source.content = req.body.content;
  }

  await source.save();

  res.send();
}
