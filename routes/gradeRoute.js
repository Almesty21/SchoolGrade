const express = require('express');
const gradeRouter = express();
const {createGrade,calculate, getAllGrades, updateGrade, deleteGrade} = require('../controller/gradeController');

gradeRouter.post('/create-grades', createGrade);
gradeRouter.get('/calculate', calculate);
gradeRouter.get('/get-grades', getAllGrades);
gradeRouter.put('/edit-grades',updateGrade);
gradeRouter.delete('/delete-grades',deleteGrade);

module.exports=gradeRouter;

