// server for run the example
const port = 8013
const express = require('express')
const path = require('path')


const app = express()

app.use('/dist', express.static(path.resolve(__dirname, './dist')))
app.use('/', express.static(path.resolve(__dirname, './example')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './example/index.html'))
})

app.listen(port)
console.log(`Server started: 127.0.0.1: ${port}`)
