const key = process.env.DEPLOY_ENV

const environment = key
const VERSION = '0.1.0'

module.exports = {
  DEPLOYKEY: key,
  ENVIRONMENT: environment,
  VERSION,
}
