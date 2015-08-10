var models = require('../models/models.js');
// get quizes / question
exports.index= function(req, res){
	models.Quiz.findAll().then(function(quizes){
		res.render('quizes/index.ejs',{quizes: quizes});
	})
};




// get quizes / answer
exports.answer= function(req, res){

	models.Quiz.find(req.params.quizId).then(function(quiz){
		if (req.query.respuesta===quiz.respuesta){
			res.render('quizes/answer',{quiz:quiz,respuesta:'Correcta'}) 
		}else{
			res.render('quizes/answer',{quiz:quiz,respuesta:'Incorrecto'}) 
		}
	})
};