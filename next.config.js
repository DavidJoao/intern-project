const { i18n } = require('./next-i18next.config')

module.exports = {
  i18n,
  images: {
    domains: ["boothgrading-bucket.s3.us-west-1.amazonaws.com", "st4.depositphotos.com"]
  },
  env: {
    DATABASE_URL: process.env.NEXT_PUBLIC_DATABASE_URL,
  },
}

