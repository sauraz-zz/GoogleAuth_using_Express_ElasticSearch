const router = require('express').Router();
const passport = require('passport');

router.get("/login",passport.authenticate('google',{
    scope:['email']
}));

router.get("/logout",(req,res)=>{
    req.logout();
    res.redirect('/logout');
});

//callback from google
router.get("/google/callback",passport.authenticate('google',{ 
    failureRedirect: '/auth/login' 
}),(req,res)=>{
    res.redirect(req.session.returnTo || '/');
    delete req.session.returnTo;
});

module.exports = router;
