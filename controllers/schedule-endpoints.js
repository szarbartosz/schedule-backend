const schedulesRouter = require('express').Router()
const Schedule = require('../models/schedule')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

schedulesRouter.get('/', async (request, response) => {
  const schedules = await Schedule.find({}).populate('user', { username: 1 }).sort({ deadline: 1 })

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

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

schedulesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  // eslint-disable-next-line no-undef
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!token || !decodedToken) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

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

schedulesRouter.delete('/:id', async (request, response) => {
  await Schedule.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

schedulesRouter.put('/:id', async (request, response) => {
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

  const updatedSchedule = await Schedule.findByIdAndUpdate(request.params.id, schedule, { new: true })

  response.json(updatedSchedule)
})

module.exports = schedulesRouter

