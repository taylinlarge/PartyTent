const express = require('express'),
      app = express(),
	  mongoose = require('mongoose'),
	  bodyParser = require('body-parser');

	app.use(bodyParser.urlencoded({extended: false}))
	app.use(bodyParser.json())

	mongoose.connect('mongodb://localhost/test',{ useMongoclient: true});
	var db = mongoose.connections;


	// app.get('/',function(req,res) {
	// 	res.send('hello World');
	// })

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
		next();
	});

	var PartyTent = mongoose.model('PartyTent', { 
		name: {type: String, required: true},
		beer: Boolean,
		music: Boolean,
		liquor: Boolean,
		other: Boolean,
		description: String,
		image: Boolean,
		long: Number,
		lat: Number,
	});

	app.get('/partytent', function(req, res) {
		
		PartyTent.find({}, function(err, tents) {	
			console.log(err, tents);

			if (err) {
				res.send(500, "Server Error")
			} else if (!tents){
				res.send(400, "Cant find Party Tent")
			} else {
				res.json(tents);
			}

		})	
	})

	app.post('/partytent', function(req, res) {
		var tentsPitched;
		var tent;
		console.log(req.body);
		PartyTent.find({},function(err, tents) {
			tentsPitched = tents.length;
			tent = new PartyTent({
				name: req.body.name,
				beer: req.body.beer,
				music: req.body.music,
				liquor: req.body.liquor,
				other: req.body.other,
				description: req.body.description,
				image: req.body.image,
				long: req.body.long,
				lat: req.body.lat,
			});
			tent.save(function (err) {
				if (err) {
					// console.log(err, "shit");
					res.send(err)
				} else {
					// console.log('marker.title');
					res.json(req.body);
				}
			});
		})
	})



app.listen(3838, function() {
	console.log('listening on port: 3838');
})