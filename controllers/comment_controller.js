var models = require('../models/models.js');

// get quizes / new
exports.new= function(req, res){
	res.render('comments/new.ejs',{quizid: req.params.quizId, errors: []});
};


// post quizes / create
exports.create = function(req, res){
var comment = models.Comment.build( 
	{ texto: req.body.comment.texto,
	QuizId:  req.params.quizId
	 });

var errors = comment.validate();//ya qe el objeto errors no tiene then(
if (errors)
{
var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
for (var prop in errors) errores[i++]={message: errors[prop]};	
	console.log(prop);
res.render('comments/new.ejs', {comment: comment, quizid: req.params.quizId, errors: errores});
} else {
comment // save: guarda en DB campos texto de comment
.save()
.then( function(){ res.redirect('/quizes/'+req.params.quizId)});
}
};

