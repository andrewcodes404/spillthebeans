const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const docSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true
  },
  slug: String,
  created: {
    type: Date,
    default: Date.now
  },

  hero_url: String,
  public_id : String,
  version : String,
  format : String,

  blog_content :String,
  tags : {type: Array, trim: true},
  seo_desc : String
});


docSchema.pre('save', async function(next) {
  if (!this.isModified('title')) {
    next(); // skip it
    return; // stop this function from running
  }
  this.slug = slug(this.title);
  // find other stores that have a slug of wes, wes-1, wes-2
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const docsWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (docsWithSlug.length) {
    this.slug = `${this.slug}-${docsWithSlug.length + 1}`;
  }
  next();
});


docSchema.statics.fourMostRecent = function() {
  return this.aggregate([
    {$sort: {created: -1}},
    {$limit: 4}
  ]);
}

docSchema.statics.tagQuery = function() {
  return this.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
}





module.exports = mongoose.model('Doc', docSchema);
