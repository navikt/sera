var mongoose = require('mongoose')

var unitSchema = new mongoose.Schema({
    name: {type: String, lowercase: true},
    applications: [String]
})

unitSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret._id
        delete ret.__v
    }
})

var toLowerCase = function (str) {
    return str.toLowerCase()
}

unitSchema.statics.createFromObject = function (obj) {
    return new Unit({
        name: obj.name,
        applications: obj.applications.map(toLowerCase)
    });
}

module.exports = Unit = mongoose.model('Unit', unitSchema)
