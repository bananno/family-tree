import mongoose from 'mongoose';

import PersonAvatarModel from '../person/avatar/PersonAvatar.model.js';
import UploadedFileModel from './UploadedFile.model.js';

// TODO: add category field to the file and add more relationships to other models.
// Filtering things manually for now / still deciding what those relationships should be.
export default async function listUploadedFilesRoute(req, res) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;
  const category = req.query.category;

  const { avatarsByFileId, imageUrls, imageParentByUrl } =
    await buildCategoryMaps();

  const fileQuery = await buildFileQuery(category, avatarsByFileId, imageUrls);

  const [uploadedFiles, totalCount] = await Promise.all([
    UploadedFileModel.find(fileQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    UploadedFileModel.countDocuments(fileQuery),
  ]);

  const items = uploadedFiles.map(file => {
    const avatar = avatarsByFileId[file._id.toString()];
    const parent = imageParentByUrl[file.url()] || null;
    return {
      ...file.toApi(),
      category: getFileCategory(file, avatarsByFileId, imageUrls),
      person: avatar || null,
      parent,
    };
  });

  res.json({
    items,
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
  });
}

////////////////////

async function buildFileQuery(category, avatarsByFileId, imageUrls) {
  if (category !== 'avatar' && category !== 'unknown' && category !== 'other') {
    return {};
  }

  const allFiles = await UploadedFileModel.find({}, '_id key');
  const matchingIds = allFiles
    .filter(f => getFileCategory(f, avatarsByFileId, imageUrls) === category)
    .map(f => f._id);
  return { _id: { $in: matchingIds } };
}

async function buildCategoryMaps() {
  const [allAvatars, allImages, allStories, allSources] = await Promise.all([
    PersonAvatarModel.find().populate('person', 'name'),
    mongoose.model('Image').find({}, 'url'),
    mongoose.model('Story').find({}, 'title images'),
    mongoose.model('Source').find({}, 'title images'),
  ]);

  const avatarsByFileId = buildAvatarMap(allAvatars);
  const imageParentByUrl = buildImageParentMap(
    allImages,
    allStories,
    allSources,
  );
  const imageUrls = new Set(allImages.map(img => img.url));

  return { avatarsByFileId, imageUrls, imageParentByUrl };
}

function buildAvatarMap(allAvatars) {
  const avatarsByFileId = {};
  for (const avatar of allAvatars) {
    avatarsByFileId[avatar.file.toString()] = {
      personId: avatar.person._id.toString(),
      personName: avatar.person.name,
    };
  }
  return avatarsByFileId;
}

function buildImageParentMap(allImages, allStories, allSources) {
  const imageParentByUrl = {};

  for (const story of allStories) {
    addImageParents(imageParentByUrl, allImages, story.images, 'story', story);
  }

  for (const source of allSources) {
    addImageParents(
      imageParentByUrl,
      allImages,
      source.images,
      'source',
      source,
    );
  }

  return imageParentByUrl;
}

function addImageParents(
  imageParentByUrl,
  allImages,
  imageIds,
  parentType,
  parent,
) {
  for (const imageId of imageIds) {
    const image = allImages.find(img => img._id.equals(imageId));
    if (image && !imageParentByUrl[image.url]) {
      imageParentByUrl[image.url] = {
        parentType,
        parentId: parent._id.toString(),
        parentTitle: parent.title,
      };
    }
  }
}

function getFileCategory(file, avatarsByFileId, imageUrls) {
  if (avatarsByFileId[file._id.toString()]) {
    return 'avatar';
  }
  if (imageUrls.has(file.url())) {
    return 'other';
  }
  return 'unknown';
}
