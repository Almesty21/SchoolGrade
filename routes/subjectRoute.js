
const express = require('express');
const subjectRouter = express();
const {registerSubject, getAllSubjects,  editSubject ,deleteSubject} = require('../controller/subjectController');

subjectRouter.post('/create', registerSubject);
subjectRouter.get('/get', getAllSubjects);
subjectRouter.put('/updates',editSubject);
subjectRouter.delete('/delete',deleteSubject);

module.exports=subjectRouter;

