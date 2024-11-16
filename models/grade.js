const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    studentID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    subjectID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true,
    },
    quiz: {
        type: Number,
        required: true,
    },
    midterm: {
        type: Number,
        required: true,
    },
    final: {
        type: Number,
        required: true,
    },
    total: {
        type: Number, // This will be automatically calculated as quiz + midterm + final
    },
    numSubject:{
       type:Number,
    },    
    average: {
        type: Number, // This will be calculated as total / max possible marks
    },
    grade: {
        type: String, // This will be dynamically calculated based on the average percentage
    },
    rank: {
        type: Number, // Optional: You could calculate and store ranks if needed
    },
}, {
    timestamps: true,
});

// Pre-save hook to calculate total, average, and grade before saving the document
gradeSchema.pre('save', function(next) {
    if (this.quiz != null && this.midterm != null && this.final != null) {
        // Assuming each part (quiz, midterm, final) is out of 100
        const totalMarks = this.quiz + this.midterm + this.final;
        this.total = totalMarks;
        
        // Calculate average percentage
        this.average = (totalMarks / numSubject);  // the maximum total (quiz + midterm + final)

        // Assign grade based on average percentage
        if (this.average >= 90) this.grade = 'A';
        else if (this.average >= 80) this.grade = 'B';
        else if (this.average >= 70) this.grade = 'C';
        else if (this.average >= 60) this.grade = 'D';
        else this.grade = 'F';
    }
    next();
});

const Grade = mongoose.model("Grade", gradeSchema);
module.exports = Grade;
