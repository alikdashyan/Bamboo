const sgMail = require('@sendgrid/mail').setApiKey(process.env.SENDGRID_API_KEY)

module.exports = sgMail