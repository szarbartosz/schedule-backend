const mongoose = require('mongoose')

const scheduleSchema = new mongoose.Schema({
  object: {
    type: String,
    required: true
  },
  investor: {
    type: String,
    required: true
  },
  designer: {
    type: String,
    required: true
  },
  applicationDate: {
    type: Date,
    required: true
  },
  decisionDate: {
    type: Date,
    required: true
  },
  deadline: {
    type: Date,
    required: false
  },
  clipping: Boolean,
  visible: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

scheduleSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Schedule', scheduleSchema)