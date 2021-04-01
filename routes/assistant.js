var express = require('express');
var router = express.Router();

const { conversation, Image } = require("@assistant/conversation");
const jwt_decode = require('jwt-decode');
const User = require('../models/user')


const app = conversation({
  clientId: process.env.ACTIONS_CLIENT_ID
});
app.handle("GET_TODAY", (conv) => {

  conv.add("Excuse me, did you ask me: " + conv.intent["query"] + "?");
  conv.add(
    new Image({
      url:
        "https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/imgs/160204193356-01-cat-500.jpg",
      alt: "A cat",
    })
  );
});

app.handle("CREATE_USER", async conv => {
  let token = conv.headers.authorization;
  let message = "";
  if (token) {
    try{
      var decoded = jwt_decode(token)
      let thisUser = await User.findOne({'googleId': decoded.sub})
      if(thisUser){
        conv.add(`Authenticated user: ${thisUser.name}.  Welcome back`)
        conv.add(
          new Image({
            url: decoded.picture,
            alt: "Profile Picture",
          })
        );
      }else{
        conv.add(`It looks like you dont have an account with us, check out reminders are us dot com to create one`)
      }
      
    }catch(err){
      console.log(err);
    }

  }
  return 
});

router.post('/hook', app)

module.exports = router;
