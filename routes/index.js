var express = require('express');
var router = express.Router();

const authCheck = (req,res,next) =>{
  if(!req.user){
    req.session.returnTo = req.path; 
    res.redirect('/auth/login');
  }else{
    next();
  }
};

/* GET home page. */
router.get('/', authCheck ,function(req, res) {
  res.send({ title: req.user });
});

router.get('/logout',function(req, res) {
  res.send("You have logged out");
});

router.get('/test', authCheck ,function(req, res) {
  res.send({ title: req.user });
});

module.exports = router;
