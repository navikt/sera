const Ajv = require('ajv')
const fetch = require('node-fetch')


exports.validator = (data, definition) => {
    const ajv = new Ajv()
    const validate = ajv.compile(definition)
    let results = {
        valid: true,
        invalidElements: [],
    }
    data.forEach(e => {
        const valid = validate(e)
        if (!valid) {
            results.valid = false
            results.invalidElements.push({
                element: e,
                errors: validate.errors
            })
        }
    })
    return results
}

exports.fetch = (url, options = {headers: {'Accept': 'application/json'}, method: 'GET'}) => {
    return fetch(url, options)
        .then(res => {
            if (res.ok) {
                return res.json()
                    .then(json => {
                        return json
                    })
            } else {
                return res.json()
                    .then(json => {
                        throw json
                    })
            }
        })
        .catch(err => {
            throw err
        })
}

exports.createFields = (item) => {
    let fields = []
    const createFields = (item, parent) => {
        Object.keys(item).forEach(key => {
            if (!item[key]) item[key] = 'n/a'
            if (typeof(item[key]) === 'object') return createFields(item[key], key)
            else parent ? fields.push(parent + '.' + key) : fields.push(key)
        })
    }
    createFields(item)
    return fields
}


exports.removeKeys = (item, keys) => {
    const removeKeys = (item, keys) => {
        if (!item) item = {}
        let obj = item
        Object.keys(item).forEach(key => {
            keys.forEach(e => {
                if (key === e) delete obj[key]
            })
            if (typeof(item[key]) === 'object') removeKeys(item[key], keys)
        })
        return obj
    }
    return removeKeys(item, keys)
}