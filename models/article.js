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

// pre fonksiyonu veritabanına herhangi bir işlem yapmadan önce yapılacak olan validasyon işlemlerini yapıyoruz
articleSchema.pre("validate", function(next) {
  //slug urlde id yerine her bir blogun başlığının görünmesini sağlıyor.
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // altta yaptığımız dompurify ise injection saldırılarına karşı koruma sağlıyor. Bazı özel karakterleri string formatına dönüştürüyor.
  if (this.markdown) {
    this.senitizedHTML = dompurify.sanitize(marked(this.markdown));
  }

  next();
});

module.exports = mongoose.model("Article", articleSchema);
