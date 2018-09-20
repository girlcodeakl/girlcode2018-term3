//set up
let databasePosts = null;
let express = require("express");
let bodyParser = require("body-parser");
let Filter = require("bad-words");
let sanitizer = require('sanitizer');

let app = express();
filter = new Filter();

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + "/public"));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//make an empty list
let posts = [];

//let a client GET the list
function sendPostsList(request, response) {
  response.send(posts);
}

app.get("/posts", sendPostsList);
app.get('/post', function (request, response) {
   let searchId = request.query.id;
   console.log("Searching for post " + searchId);
   let post = posts.find(x => x.id == searchId);
   response.send(post);
});

//let a client POST something new
function saveNewPost(request, response) {
  let post = {};
  let cleanMessage = filter.clean(request.body.message);
  post.message = sanitizer.sanitize(cleanMessage);
  let cleanImage = filter.clean(request.body.image);
  post.image = sanitizer.sanitize(cleanImage);
  let cleanAuthor = filter.clean(request.body.author);
  post.author = sanitizer.sanitize(cleanAuthor);
  if (post.image === "") {
    post.image = "https://png.icons8.com/ios/1600/no-camera.png"
  }
  post.time = new Date();
  post.id = Math.round(Math.random() * 10000);
  console.log (post);
  databasePosts.insert(post);
  post.comments = [];
  posts.push(post); //save it in our list
  response.send("thanks for your message. Press back to add another");
}
app.post("/posts", saveNewPost);

//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");
let MongoClient = require("mongodb").MongoClient;
let databaseUrl =
  "mongodb://mjakowetz:girlcode123@ds147592.mlab.com:47592/keep-posts-when-server-restarts-jb-mj";
let databaseName = "keep-posts-when-server-restarts-jb-mj";

MongoClient.connect(
  databaseUrl,
  { useNewUrlParser: true },
  function(err, client) {
    if (err) throw err;
    console.log("yay we connected to the database");
    let database = client.db(databaseName);
    databasePosts = database.collection("posts");
    databasePosts.find({}).toArray(function(err, results) {
      console.log("Found " + results.length + " results");
      posts = results;
    });
  }
);
