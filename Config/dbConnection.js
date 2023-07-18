const { default: mongoose } = require("mongoose");


const DBConnection = () => {
    mongoose.connect(process.env.DB_URI).then((db) => {
        console.log('\x1b[36m%s\x1b[0m', `${"-".repeat(68)}\nDB Connection Successful: ${db.connection.host}\n${"-".repeat(68)}`)
    })
}

module.exports = DBConnection