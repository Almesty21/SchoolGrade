const Subject = require('../models/subject');

// Register a new subject
exports.registerSubject = async (req, res) => {
  console.log('Register Subject endpoint hit');
  console.log('Request body:', req.body);

  try {
    const { name, teacher, maxMarks } = req.body;

    if (!name || !maxMarks) {
      return res.status(400).json({ message: 'Name and max marks are required.' });
    }

    const newSubject = new Subject({
      name,
      teacher,
      maxMarks,
    });

    const subject = await newSubject.save();
    res.json(subject);

  } catch (error) {
    console.error('Error registering subject:', error);
    res.status(500).json({ message: `Error: ${error.message}` });
  }
};

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().select('name teacher maxMarks');
    res.json(subjects);
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

// Edit a subject
exports.editSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name || updates.teacher || updates.maxMarks) {
      const subject = await Subject.findByIdAndUpdate(id, updates, { new: true });
      res.json(subject);
    } else {
      res.status(400).json({ message: 'No valid fields provided for update' });
    }
  } catch (error) {
    res.status(400).json({ message: `Error: ${error.message}` });
  }
};

// Delete a subject
exports.deleteSubject = async (req, res) => {
  const { id } = req.params;
  console.log('id in deleteSubject:', id);

  try {
    const subject = await Subject.findByIdAndDelete(id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
