const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  markdown: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  senitizedHTML: {
    type: String,
    required: true
  }
});

articleSchema.pre("validate", function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.markdown) {
    this.senitizedHTML = dompurify.sanitize(marked(this.markdown));
  }

  next();
});

module.exports = mongoose.model("Article", articleSchema);
