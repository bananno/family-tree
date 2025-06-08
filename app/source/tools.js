export default {
  convertParamSourceId1,
  convertParamSourceId2,
  createRenderSource,
};

function createRenderSource(req, res, next) {
  res.renderSource = (subview, options = {}) => {
    const title = options.title ||
      [req.source.story.title, req.source.title].filter(Boolean).join(' - ');

    res.render('source/_layout', {
      subview,
      title,
      source: req.source,
      rootPath: req.rootPath,
      ...options
    });
  };
  next();
}

async function convertParamSourceId1(req, res, next, sourceId) { // :id
  if (req.originalUrl.slice(0, 7) === '/source') {
    req.sourceId = sourceId;
    req.rootPath = '/source/' + sourceId;
  }
  next();
}

async function convertParamSourceId2(req, res, next, sourceId) { // :sourceId
  req.sourceId = sourceId;
  req.rootPath = '/source/' + sourceId;
  next();
}
