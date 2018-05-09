const mongoose = require('mongoose');
const Doc = mongoose.model('Doc');
const multer = require('multer');

const uuid = require('uuid');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
// const asyncBusboy = require('async-busboy')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'spillthebeans',
  allowedFormats: ['jpg', 'png'],
  filename: function (req, file, cb) {
    cb(undefined, uuid.v4());
  },
});
// **-For image upload-** **-For image upload-** **-For image upload-**
const multerOptions = {
  storage: storage,
  fileFilter(req, file, next) {
    const isImage = file.mimetype.startsWith('image/');
    if(isImage) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed!' }, false);
    }
  }
};
exports.upload = multer(multerOptions).single('heroImg');

exports.imageURL = (req, res, next) => {
  if (!req.file) {
    next(); // skip to the next middleware
    return;
  }

  req.body.hero_url = req.file.secure_url
  req.body.public_id = req.file.public_id
  req.body.version = req.file.version
  req.body.format = req.file.format
  next();
}


// **- Routes -**  **- Routes -** **- Routes -** **- Routes -**
exports.home = async (req, res) => {
  docs = await Doc.fourMostRecent();
  res.render('home', {title: 'home', docs})
}

exports.about = async (req, res) => {
  docs = await Doc.fourMostRecent();
  res.render('about', {docs})
}

// recipe single
exports.recipe = async (req, res, next) => {
  const path = req.path;
  const recipeDoc = await Doc.findOne({ slug : req.params.slug})
  if (!recipeDoc) return next();
  res.render('recipe', {recipeDoc, path})
}

// recipes all

exports.recipes = async (req, res) => {
  //a static query to aggregate the tags --> Doc.js
  const tagsPromise = Doc.tagQuery();
  //NOW match the docs with the tag

  //1. Make a variable with the param
  const tag = req.params.tag;
  //2. Create our query.. if tag exists or blank if not
  const tagQuery = tag || { $exists: true, $ne: [] };
  //3. use our tagQuery in a find(), if it's empty it will return all the docs
  const docsPromise = Doc.find({ tags: tagQuery })

  //Multiple queries need to async at the time
  const [tags, docs] = await Promise.all([tagsPromise, docsPromise])
  res.render('recipes', {tags, docs})
}


//ADD
//Editor
exports.editor = (req, res) => {
  res.render('editor', { title: 'editDoc.pug' });
};

//Create a doc - POST

//just to check your getting the req.body
// exports.createDoc = (req, res) => {res.json(tagsArray);};

exports.createDoc= async (req, res) => {
  var tagsArray = req.body.tags.replace(/[\W_]+[-]+/g," ").match(/\S+/g);
  req.body.tags = tagsArray
  const doc = new Doc(req.body);
  await doc.save();
  //or a short version
  //const store = await (new Store(req.body)).save();
  res.redirect('/');
};


// EDIT
// edit GET
exports.editDoc = async (req, res) => {
  const doc = await Doc.findOne({slug : req.params.slug});
  console.log(doc.tags);
  const stringy = doc.tags.toString().replace(/,/g , " ");

  console.log(stringy);
  res.render('editor', { title: `Edit ${doc.title}`, doc, stringy});
};

// edit/update POST
exports.updateDoc = async (req, res) => {
  var tagsArray = req.body.tags.replace(/[\W_]+[-]+/g," ").match(/\S+/g);

  req.body.tags = tagsArray
  const doc = await Doc.findOneAndUpdate({ slug: req.params.slug }, req.body, {
    new: true, // return the new doc instead of the old one
    runValidators: true
  }).exec();
  req.flash('success', `Success ${doc.title} updated`);

  res.redirect(`/`);
};

exports.login = (req, res) => {
    res.render('login', {title: 'login.pug'})
}















//lols
