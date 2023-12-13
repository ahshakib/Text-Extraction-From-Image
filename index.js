const express = require("express");
const multer = require("multer");
const path = require("path");
const tesseract = require("node-tesseract-ocr")

const app = express();

const port = 3000;


app.use(express.static(path.join(__dirname + "/uploads")));
app.use(express.static(path.join(__dirname, 'public')));



app.set("view engine", "ejs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index", {data:''});
});

app.post("/textfromimage", upload.single("file"), (req, res) => {
    const config = {
        lang: "eng",
        oem: 1,
        psm: 3,
        binary: 'D:\\Tesseract-OCR\\tesseract.exe'
      }
      
      tesseract
        .recognize(req.file.path, config)
        .then((text) => {
          res.render('index', {data:text})
        })
        .catch((error) => {
          console.log(error.message)
        })
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});