// routes.js
const express = require('express');

const userRouter = require('./userRoute');
const gradeRouter=require('./gradeRoute')
const studentRouter=require('./studentRoute')
const subjectRouter=require('./subjectRoute')
const router = express.Router();

// Use routes
router.use('/users', userRouter);
router.use('/grades',gradeRouter);
router.use('/student',studentRouter);
router.use('/subject',subjectRouter);
module.exports = router;
