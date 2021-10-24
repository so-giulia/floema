const express = require('express')
const app = express()
// need the path to set folder
const path = require('path')
const port = 3000

// set the folder from which the files will be rendered + tell it's pug
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('pages/home')
})

app.get('/about', (req, res) => {
  res.render('pages/about')
})

app.get('/collections', (req, res) => {
  res.render('pages/collections')
})

app.get('/detail/:id', (req, res) => {
  res.render('pages/detail/:id')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
