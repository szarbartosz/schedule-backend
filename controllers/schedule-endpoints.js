const schedulesRouter = require('express').Router()
const Schedule = require('../models/schedule')

schedulesRouter.get('/', async (request, response) => {
  const schedules = await Schedule.find({})
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

  const clippingSchedule = new Schedule({
    object: body.object,
    investor: body.investor,
    designer: body.designer,
    applicationDate: body.applicationDate,
    decisionDate: body.decisionDate,
    clippingDeadline: body.clippingDeadline,
    plantingDeadline: null,
    visible: body.visible || true
  })

  const plantingSchedule = new Schedule({
    object: body.object,
    investor: body.investor,
    designer: body.designer,
    applicationDate: body.applicationDate,
    decisionDate: body.decisionDate,
    clippingDeadline: null,
    plantingDeadline: body.plantingDeadline,
    visible: body.visible || true
  })

  const savedSchedules = [await clippingSchedule.save(), await plantingSchedule.save()]

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

