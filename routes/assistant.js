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

async function getUser(token){
  try{
    if (token) {
      var decoded = jwt_decode(token)
      let thisUser = await User.findOne({'googleId': decoded.sub})
      return thisUser
    } else
      return null
      
  } catch(err){
    console.log(err)
  }
  

}

app.handle("CHECK_USER", async conv => {
  let message = "";
    try{
      let thisUser = await getUser(conv.headers.authorization)
      if(thisUser){
        console.log(conv.user)
        conv.user.params.test = "test"
        conv.add(`Authenticated user: ${thisUser.name}.  Welcome back`)
        conv.add(
          new Image({
            url: conv.user.params.tokenPayload.picture,
            alt: "Profile Picture",
          })
        );
      }else{
        conv.close('It looks like you dont have an account with us, visit us at blah blah dot com')
      }
      
    }catch(err){
      console.log(err);
    }

  
});

router.post('/hook', app)

module.exports = router;
