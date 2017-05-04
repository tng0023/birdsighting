var express = require('express');
var router = express.Router();
var Type = require('../models/type');

/*GET home page */
router.get('/', function(req, res){
  Type.find(function(err,types){
    if(err){
      return next(err);
    }
    res.render('index',{types: types});
  })
});

router.post('/', function(req, res, next){

  var typeData = {};

  for (var field in req.body){
    if(req.body[field]){
      typeData[field] = req.body[field];
    }
  }

var type = Type(typeData); //Create new Type from req.body

type.save(function(err, newtype){
  if(err){

    if(err.name=='ValidationError'){
      //Loop over error messages and add the message to messages array
      var messages=[];
      for(var err_name in err.errors){
        messages.push(err.errors[err_name].message);
      }
      req.flash('error', messages);
      return res.redirect('/')
    }

    if(err.code==11000){ //Duplicate key error code
      req.flash('error', 'A reminder with that name already exists');
      return res. redirect('/')
    }

    return next(err);
  }

  console.log(newtype);
  return res.redirect('/')
})
});

router.post('/delete', function(req,res,next){

  var id = req.body._id;
  Type.findByIdAndRemove(id, function(err, type){

  if(err){
    return next(err);
  }
  if(!type){
    var req_err = new Error('type not found');
    req_err.status = 404;
    return next(req_err);
  }
  req.flash('info','Deleted');
  return res.redirect('/')
  })
});

module.exports = router;
