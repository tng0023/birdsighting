var express = require('express');
var router = express.Router();
var Bird = require('../models/bird');

/* GET home page. */
router.get('/', function(req, res, next) {
  Bird.find(function(err,birds){
    if(err){
      return next(err);
    }
  res.render('index', { birds: birds });
})
});

/* POST to home page - handle form submit */
router.post('/', function(req, res, next){

  var birdData={};

  for(var field in req.body){
    if(req.body[field]){
      birdData[field] = req.body[field];
    }
  }

if(birdData.nestLocation || birdData.nestMaterials){
  birdData.nest = {
    location: birdData.nestLocation,
    materials: birdData.nestMaterials
  };
}

//remove non-nested data
delete(birdData.nestLocation); delete(birdData.nestMaterials);

//Extract the date, set to Date.now() if not present
var date = birdData.dateSeen || Date.now();
birdData.datesSeen = [ date ]; // A 1-element array
delete(birdData.dateSeen); //remove dateSeen, don't need

console.log(birdData);

var bird = Bird(birdData); //Create new Bird from req.body

bird.save(function(err, newbird){
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
      req.flash('error', 'A bird with that name already exists');
      return res. redirect('/')
    }

    return next(err);
  }

  console.log(newbird);
  return res.redirect('/')
})
});

router.post('/delete', function(req,res,next){

  var id = req.body._id;
  Bird.findByIdAndRemove(id, function(err, bird){

  if(err){
    return next(err);
  }
  if(!bird){
    var req_err = new Error('bird not found');
    req_err.status = 404;
    return next(req_err);
  }
  req.flash('info','Deleted');
  return res.redirect('/')
  })
});

router.post('/addDate', function(req, res, next){
  if(!req.body.dateSeen){
    req.flash('error', 'Please provide a date fo your sighting of ' + req.body.name);
    return res.redirect('/');
  }
  //find the bird with the given ID, and add this new date to the datesSeen array
  Bird.findById(req.body._id, function(err, bird){
    if(err){
      return next(err);
    }
    if(!bird){
      res.statusCode = 404;
      return next(new Error('Not found, bird with _id ' + req.body._id))
    }

    bird.datesSeen.push(req.body.dateSeen);

    bird.save(function(err){
      if(err){
        if(err.name == 'ValidationError'){
          //Loop over error messages and add the message to messagse array
          var messages = [];
          for(var err_name in err.errors){
            messages.push(err.errors[err_name].message);
          }
          req.flash('error', messages);
          return res.redirect('/')
        }
        return next(err);
      }
        return res.redirect('/');
      })
  });
});

module.exports = router;
