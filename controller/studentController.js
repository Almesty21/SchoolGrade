const Student = require('../models/student');

// Register a new student
exports.registerStudent = async (req, res) => {
  console.log('Register Student endpoint hit');
  console.log('Request body:', req.body);

  try {
    const { name, studentID, class: studentClass } = req.body;

    if (!name || !studentID || !studentClass) {
      return res.status(400).json({ message: 'Name, student ID, and class are required.' });
    }

    const newStudent = new Student({
      name,
      studentID,
      class: studentClass,
    });

    const student = await newStudent.save();
    res.json(student);

  } catch (error) {
    console.error('Error registering student:', error);
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().select('name studentID class');
    res.json(students);
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

// Edit a student
exports.editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name || updates.studentID || updates.class) {
      const student = await Student.findByIdAndUpdate(id, updates, { new: true });
      res.json(student);
    } else {
      res.status(400).json({ message: 'No valid fields provided for update' });
    }
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

// Delete a student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  console.log('id in deleteStudent:', id);

  try {
    const student = await Student.findByIdAndDelete(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
