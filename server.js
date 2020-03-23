const express = require("express");
const app = express();

const articleRoutes = require("./routes/articles");

app.set("view engine", "ejs");

app.use("/articles", articleRoutes);

app.get("/", (req, res) => {
  const articles = [
    {
      title: "Article1",
      date: new Date(),
      desc: "dummy desc here"
    }
  ];
  res.render("index", { articles: articles });
});

app.listen(5000);
