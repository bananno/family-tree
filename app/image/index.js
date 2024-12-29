import { createController, getEditTableRows } from '../import.js';
import createModel from '../tools/createModel.js';
import resources from '../resources.js';

export default function createRoutes(router) {
  const resource = resources.find(resource => resource.name === 'image');
  const Image = createModel(resource);

  createController({
    Model: Image,
    modelName: 'image',
    router: router,
    routes: {
      show: showImage,
    },
    editFromMainShowView: true,
  });
}

async function showImage(req, res) {
  const imageId = req.params.id;
  const image = await Image.findById(imageId).populate('tags');
  req.rootPath = '/image/' + image._id;

  if (!image) {
    return res.send('Image not found.');
  }

  await image.populateParent();

  const tableRows = await getEditTableRows({
    item: image,
    rootPath: req.rootPath,
  });

  res.render('image/show', {
    title: 'Image',
    image,
    rootPath: req.rootPath,
    itemName: 'image',
    tableRows,
  });
}
