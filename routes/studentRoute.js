
const express = require('express');
const studentRouter = express();
const {registerStudent, getAllStudents, editStudent, deleteStudent} = require('../controller/studentController');

studentRouter.post('/create', registerStudent);
studentRouter.get('/get', getAllStudents);
studentRouter.put('/updates',editStudent);
studentRouter.delete('/delete',deleteStudent);

module.exports=studentRouter;

