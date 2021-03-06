var models = require('../models/models.js');

//Autoload - factoriza el codigo si ruta inclute : quizId
exports.load= function(req, res, next, quizId){
	models.Quiz.find({
		where: { id: Number(quizId)},
		include: [{model: models.Comment}]
	}).then(function(quiz){
		if (quiz) {
			req.quiz= quiz;
			next();
		}else{ next(new Error('No existe quizId=' + quizId));}
		
	}).catch(function(error){next(error);});
};


// GET /quizes
exports.index = function(req, res){
	if(req.query.search){
		var search = '%' + req.query.search.replace(/\s/g,"%") + '%';
		var tema ='%' +req.query.tema.replace("Todos",'')+'%';
		models.Quiz.findAll(
			{where: ["pregunta like ? and tema like ?", search,tema],
			order:[['pregunta','ASC']]}
			).then(function(quizes){
				res.render('quizes/index.ejs', {quizes: quizes, errors: []});
			}).catch(function(error){next (error);});
	}else if (req.query.tema){
		var tema ='%' +req.query.tema.replace("Todos",'')+'%';
		models.Quiz.findAll(
			{where: ["tema like ?",tema],
			order:[['pregunta','ASC']]}
			).then(function(quizes){
				res.render('quizes/index.ejs', {quizes: quizes, errors: []});
			}).catch(function(error){next (error);});
	}else{
		models.Quiz.findAll().then(function (quizes) {
			res.render('quizes/index.ejs', { quizes: quizes, errors: []});
		}).catch(function(error) {next(error);});
	}
};

// get quizes / new
exports.new= function(req, res){
	var quiz = models.Quiz.build( //crea objeto quiz
	{pregunta: "Pregunta", respuesta: "Respuesta"}
		);
	res.render('quizes/new',{quiz:quiz, errors: []});
};


// get quizes / create
exports.create = function(req, res){
var quiz = models.Quiz.build( req.body.quiz );

var errors = quiz.validate();//ya qe el objeto errors no tiene then(
if (errors)
{
var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
for (var prop in errors) errores[i++]={message: errors[prop]};	
res.render('quizes/new', {quiz: quiz, errors: errores});
} else {
quiz // save: guarda en DB campos pregunta y respuesta de quiz
.save({fields: ["pregunta", "respuesta","tema"]})
.then( function(){ res.redirect('/quizes')}) ;
}
};

// get quizes / question
exports.show= function(req, res){
		res.render('quizes/show',{quiz: req.quiz, errors: []});
};

// get quizes / new
exports.edit= function(req, res){
	var quiz = req.quiz; //autoload de instancia quiz
	res.render('quizes/edit',{quiz:quiz, errors: []});
};


// get quizes / answer
exports.answer= function(req, res){
	var resultado='Incorrecto';	
		if (req.query.respuesta===req.quiz.respuesta){
			resultado='Correcto';
		}
			res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado, errors: []}) 
};

// get quizes / create
exports.update = function(req, res){
req.quiz.pregunta = req.body.quiz.pregunta;
req.quiz.respuesta = req.body.quiz.respuesta;
req.quiz.tema = req.body.quiz.tema;

var errors = req.quiz.validate();//ya qe el objeto errors no tiene then(
if (errors)
{
var i=0; var errores=new Array();//se convierte en [] con la propiedad message por compatibilida con layout
for (var prop in errors) errores[i++]={message: errors[prop]};	
res.render('quizes/new', {quiz: req.quiz, errors: errores});
} else {
req.quiz // save: guarda en DB campos pregunta y respuesta de quiz
.save({fields: ["pregunta", "respuesta", "tema"]})
.then( function(){ res.redirect('/quizes')}) ;
}   //rediraccion HTTP a lista de preguntas (URL relativo)
};

// get quizes / new
exports.destroy= function(req, res){
	req.quiz.destroy().then(function() {
	res.redirect('/quizes');
	}).catch(function(error){next(error)});
};
