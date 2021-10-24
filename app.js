require('dotenv').config()

const express = require('express')
const app = express()
// need the path to set folder
const path = require('path')
const port = 3000

const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')

// Initialize the prismic.io api
const initApi = req => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req
  })
}

const handleLinkResolver = () => {
  return '/'
}

// Middleware to inject prismic context
app.use((req, res, next) => {
  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handleLinkResolver
  }

  res.locals.PrismicDOM = PrismicDOM;
  next()
})

// set the folder from which the files will be rendered + tell it's pug
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.get('/', res => {
  res.render('pages/home')
})

app.get('/about', (req, res) => {
  initApi(req).then(api => {
    api.query(Prismic.Predicates.any('document.type', ['metadata', 'about'])).then(response => {
      const { results } = response
      const [metadata, about] = results
      console.log(metadata, about)

      res.render('pages/about', {
        metadata,
        about
      })
    })
  })
})

app.get('/collections', (req, res) => {
  res.render('pages/collections')
})

app.get('/detail/:id', (req, res) => {
  res.render('pages/detail/:uid')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
