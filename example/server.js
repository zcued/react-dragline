const express = require('express')
const path = require('path')
const port = 3008
const app = express()

app.use(express.static(path.resolve(__dirname, './dist')))

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

app.listen(port)
console.log(`Server started: 127.0.0.1: ${port}`)
