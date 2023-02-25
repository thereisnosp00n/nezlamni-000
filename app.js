require('dotenv').config()
const _ = require('lodash')
const UAParser = require('ua-parser-js')
const Prismic = require('@prismicio/client')
const PrismicDOM = require('prismic-dom')
const helpers = require('@prismicio/helpers')
const asyncHandler = require('./utils/asyncHandler')
const express = require('express')
const axios = require('axios')
const errorHandler = require('errorhandler')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const port = 3000

app.set('views', path.join(__dirname, 'views'))
app.set('public', path.join(__dirname, 'public'))
app.set('view engine', 'pug')
app.use(errorHandler())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.use(errorHandler())

app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  const ua = UAParser(req.headers['user-agent'])

  res.locals.isDesktop = ua.device.type === undefined
  res.locals.isPhone = ua.device.type === 'mobile'
  res.locals.isTablet = ua.device.type === 'tablet'

  res.locals.ctx = {
    endpoint: process.env.PRISMIC_ENDPOINT,
    linkResolver: handlelinkResolver,
    helpers,
  }
  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM
  next()
})

// app.use('/en-us', express.static(__dirname + '/public/')) Localization resolver

const initApi = (req) => {
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req: req,
  })
}

const handlelinkResolver = (doc) => {
  // Define the url depending on the document type
  if (doc.type === 'index') {
    return '/index'
  }
  return '/'
}

const requestDefaults = async (api, lang) => {
  const navigation = await api.getSingle('navigation')
  const miscellaneous = await api.getSingle('miscellaneous')

  return {
    navigation,
    miscellaneous,
    fetchSVG,
    insertBr,
    helpers,
  }
}

app.get(
  '/',
  asyncHandler(async (req, res) => {
    const api = await initApi(req)
    const defaults = await requestDefaults(api)

    const page = await api.getSingle('index')

    if (page) {
      res.render('pages/index', {
        ...defaults,
        page,
      })
    } else {
      console.log('Error rendering')
    }
  })
)

// Middleware to fetch Prismic api object
app.get(
  '*',
  asyncHandler(async (req, res, next) => {
    const api = await initApi(req)

    if (api) {
      req.prismic = { api }
    } else {
      console.log('Error 404')
    }
    next()
  })
)

function fetchSVG(imageUrl) {
  function includesMatch(lookupValue, urlString) {
    const re = new RegExp(lookupValue, 'i')
    return urlString.match(re) !== null
  }

  if (includesMatch('images.prismic', imageUrl)) {
    return `${imageUrl}&h=60&dpr=2`
  }

  return imageUrl
}

function insertBr(content) {
  content = content.replace(/\n?\r\n/g, '<br />')
  return content
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
