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

  const schedule = new Schedule({
    object: body.object,
    investor: body.investor,
    designer: body.designer,
    applicationDate: body.applicationDate,
    decisionDate: body.decisionDate,
    clippingDeadline: body.clippingDeadline,
    plantingDeadline: body.plantingDeadline,
    expired: body.expired || false
  })

  const savedSchedule = await schedule.save()
  response.json(savedSchedule)
})

schedulesRouter.delete('/:id', (request, response, next) => {
  Schedule.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

module.exports = schedulesRouter

