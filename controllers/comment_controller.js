var models = require('../models/models.js');

// get quizes / new
exports.new= function(req, res){
	var quiz = models.Quiz.build( //crea objeto quiz
	{pregunta: "Pregunta", respuesta: "Respuesta"}
		);
	res.render('quizes/new',{quiz:quiz, errors: []});
};


// post quizes / create
exports.create = function(req, res){
var quiz = models.Quiz.build( 
	{ texto: req.body.comment.texto,
	QuizId:  req.params.quizId,
	 });

var errors = comment.validate();//ya qe el objeto errors no tiene then(
if (errors)
{
var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
for (var prop in errors) errores[i++]={message: errors[prop]};	
res.render('comments/new.ejs', {comment: comment, quizid: req.params.quizId, errors: errores});
} else {
comment // save: guarda en DB campos texto de comment
.save()
.then( function(){ res.redirect('/quizes/'+req.params.quizId)}) 
}
};

