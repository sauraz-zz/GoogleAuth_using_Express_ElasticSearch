const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys = require('./keys');
const urls = require('./urls-config');
const elasticClient = require('./elastic');

passport.serializeUser(function(user, done) {
    done(null, user);
});
  
passport.deserializeUser(function(id, done) {
    elasticClient.search({
        index: 'users',
        type: 'user',
        body:{
            query:{
                match_phrase:{
                    email:id
                }
            }
        },
    }).then(function(res){
        done(null, id);
    },function(err){
        done(null);
    });
});

passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: urls.callbackURL,
    passReqToCallback   : true
},
function(request, accessToken, refreshToken, profile, done) {
    elasticClient.search({
        index: 'users',
        type: 'user',
        body:{
            query:{
                match_phrase:{
                    email:profile.email
                }
            }
        },
    }).then(function(resp) {
        //console.log(resp);
        if(resp.hits.total > 0){
            console.log(profile.email);
            done(null,profile.email)
        }
        else{
        done(null);
        }
    }, function(err) {
        console.trace(err.message);
        done(err);
    });
}));