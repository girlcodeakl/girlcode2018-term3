//set up
let databasePosts = null;
let express = require('express')
let app = express();
let bodyParser = require('body-parser')

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list
let posts = [];

//let a client GET the list
function sendPostsList(request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);

//let a client POST something new
function saveNewPost(request, response) {
  console.log(request.body.message); //write it on the command prompt so we can see
  posts.push(request.body.message); //save it in our list
  response.send("thanks for your message. Press back to add another");
  databasePosts.insert(post);
}
app.post('/posts', saveNewPost);

//listen for connections on port 3000
app.listen(3000);
console.log("Hi! I am listening at http://localhost:3000");
let MongoClient = require('mongodb').MongoClient;
let databaseUrl = 'mongodb://girlcode:hats123@ds111771.mlab.com:11771/keep-posts-same-when-server-restarts';
let databaseName = 'keep-posts-same-when-server-restarts';

MongoClient.connect(databaseUrl, {useNewUrlParser: true}, function(err, client) {
  if (err) throw err;
  console.log("yay we connected to the database");
  let database = client.db(databaseName);
  databasePosts = database.collection('posts');
  databasePosts.find({}).toArray(function(err, results) {
    console.log(err)
    console.log(results)
    console.log("Found " + results.length + " results")
    posts = results
  });
});
