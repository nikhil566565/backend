const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    username :{ type: String, required: true},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
})

const EmployeeModel = mongoose.model('employees', EmployeeSchema);
module.exports = EmployeeModel;