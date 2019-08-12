const User = require('../models/user')
const PassportUser = require('../models/passportUser')
const grs = require('randomstring')

const generateUniqueString = async () => {
    const str = grs.generate({
        length: 4,
        charset: 'alphanumeric',
        capitalization: 'lowercase'
    })
    const user = await User.findOne({userID: str})
    const pUser = await PassportUser.findOne({userID: str})
    if(!user && !pUser){
        return str
    }
    generateUniqueString()
}

module.exports = generateUniqueString