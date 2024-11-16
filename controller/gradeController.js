const express = require('express');
const mongoose = require('mongoose');
const Grade = require('../models/grade'); // Adjust the path as needed

const router = express.Router();


// Create a new grade
exports.createGrade = async (req, res) => {
  try {
      const { studentID, subjectID, quiz, midterm, final } = req.body;

      if (quiz == null || midterm == null || final == null || !studentID || !subjectID) {
          return res.status(400).json({ message: 'Quiz, Midterm, Final, studentID, and subjectID are required' });
      }

      // Create the new grade document
      const newGrade = new Grade({
          studentID,
          subjectID,
          quiz,
          midterm,
          final
      });

      // Save the grade
      await newGrade.save();
      res.status(201).json(newGrade);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

// API to calculate average, total, and rank for grades
exports.calculate= async (req, res) => {
    try {
        // Fetch all grades from the database
        const grades = await Grade.find().populate('studentID subjectID');

        // Group grades by student and subject
        const result = {};

        grades.forEach(grade => {
            const studentId = grade.studentID.toString();
            const subjectId = grade.subjectID.toString();

            if (!result[studentId]) {
                result[studentId] = {};
            }

            if (!result[studentId][subjectId]) {
                result[studentId][subjectId] = {
                    total: 0,
                    quiz: 0,
                    midterm: 0,
                    final: 0,
                    count: 0,
                };
            }

            result[studentId][subjectId].total += grade.total;
            result[studentId][subjectId].quiz += grade.quiz;
            result[studentId][subjectId].midterm += grade.midterm;
            result[studentId][subjectId].final += grade.final;
            result[studentId][subjectId].count++;
        });

        // Calculate average and rank
        const averages = [];
        for (const studentId in result) {
            for (const subjectId in result[studentId]) {
                const subjectData = result[studentId][subjectId];
                const average = subjectData.total / subjectData.count;

                averages.push({
                    studentId,
                    subjectId,
                    average,
                    total: subjectData.total,
                });
            }
        }

        // Sort by average to assign ranks
        averages.sort((a, b) => b.average - a.average);
        for (let i = 0; i < averages.length; i++) {
            averages[i].rank = i + 1; // Rank starts from 1
        }

        res.status(200).json(averages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error calculating grades', error });
    }
};


// Get all grades
exports.getAllGrades = async (req, res) => {
  try {
    const grades = await Grade.find().populate('studentID').populate('subjectID');
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get grade by ID
exports.getGradeById = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id).populate('studentID').populate('subjectID');
    if (!grade) return res.status(404).json({ message: 'Grade not found' });
    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update grade
exports.updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedGrade = await Grade.findByIdAndUpdate(id, updates, { new: true }).populate('studentID').populate('subjectID');
    if (!updatedGrade) return res.status(404).json({ message: 'Grade not found' });
    res.json(updatedGrade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete grade
exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGrade = await Grade.findByIdAndDelete(id);
    if (!deletedGrade) return res.status(404).json({ message: 'Grade not found' });
    res.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
