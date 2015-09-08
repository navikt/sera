var mongoose = require('mongoose')

var unitSchema = new mongoose.Schema({
    name: String,
    applications: [String]
})

unitSchema.set('toJSON', {
    transform: function (doc, ret, options) {
        delete ret._id
        delete ret.__v
    }
})

unitSchema.statics.createFromObject = function (obj) {
    return new Unit({
        name: obj.name,
        applications: obj.applications
    });
}

module.exports = Unit = mongoose.model('Unit', unitSchema)
