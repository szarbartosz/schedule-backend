const config = require('./utils/config')
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.send('I\'m working!')
})

module.exports = app