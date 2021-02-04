const schedulesRouter = require('express').Router()
const Schedule = require('../models/schedule')
const User = require('../models/user')

schedulesRouter.get('/', async (request, response) => {
  const schedules = await Schedule.find({}).sort({ deadline: 1 })
  response.json(schedules)
})

schedulesRouter.get('/:id', async (request, response) => {
  const schedule = await Schedule.findById(request.params.id)
  if (schedule) {
    response.json(schedule)
  } else {
    response.status(404).end()
  }
})

schedulesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)

  const clippingSchedule = new Schedule({
    object: body.object,
    investor: body.investor,
    designer: body.designer,
    applicationDate: body.applicationDate,
    decisionDate: body.decisionDate,
    deadline: body.clippingDeadline,
    clipping: true,
    visible: body.visible || true,
    user: user._id
  })

  const plantingSchedule = new Schedule({
    object: body.object,
    investor: body.investor,
    designer: body.designer,
    applicationDate: body.applicationDate,
    decisionDate: body.decisionDate,
    deadline: body.plantingDeadline,
    clipping: false,
    visible: body.visible || true,
    user: user._id
  })

  const savedSchedules = [await clippingSchedule.save(), await plantingSchedule.save()]
  user.schedules = user.schedules.concat([savedSchedules[0]._id, savedSchedules[1]._id])
  await user.save()

  response.json(savedSchedules)
})

schedulesRouter.delete('/:id', (request, response, next) => {
  Schedule.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

schedulesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const schedule = {
    object: body.object,
    investor: body.investor,
    designer: body.designer,
    applicationDate: body.applicationDate,
    decisionDate: body.decisionDate,
    clippingDeadline: body.clippingDeadline,
    plantingDeadline: body.plantingDeadline,
    visible: body.visible
  }

  Schedule.findByIdAndUpdate(request.params.id, schedule, { new: true })
    .then(updatedSchedule => {
      response.json(updatedSchedule)
    })
    .catch(error => next(error))
})

module.exports = schedulesRouter

