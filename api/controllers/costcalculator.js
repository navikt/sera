var _ = require('lodash')

var calcOsCost = function (osType, environmentClass) {
    if (osType === 'rhel') {
        if (environmentClass === 'p') {
            return 590
        } else {
            return 400
        }
    } else if (osType === 'windows') {
        return 10000
    }
}

var calcMWCost = function (type, environmentClass) {
    if (type === 'jboss') {
        return 1172
    } else if (type === 'was') {
        return 5850
    } else if (type === 'bpm') {
        return 23400
    }
    else {
        return 0
    }
}

var calcBaseCost = function (osType) {
    if (osType.indexOf('Linux') > -1) {
        return 520
    } else if (osType.indexOf('Windows') > -1) {
        return 520
    } else {
        return 0
    }
}

var calcITCAMCost = function (type, environment) {
    if (_.startsWith(type, 'was') || _.startsWith(type, 'bpm')) {
        var itcamEnvironments = ['q0', 'q1', 'q3', 't3']
        if (environment === 'p') {
            return 20500
        } else if (_.contains(itcamEnvironments, environment)) {
            return 10300
        }
    } else {
        return 0
    }
}

var summarize = function (total, num) {
    return isNaN(num) ? total : total + num
}

var calculateCost = function (vm) {
    var cpu = 470 * vm.cpu
    var memory = 280 * vm.memory
    var disk = 32 * vm.disk
    var os = calcOsCost(vm.os, vm.environmentClass)
    var mw = calcMWCost(vm.type, vm.environmentClass)
    var baseCost = calcBaseCost(vm.os)
    var itcam = calcITCAMCost(vm.type, vm.environment)
    var puppet = (vm.os === 'rhel' && vm.environmentClass === 'p') ? 750 : 0
    var custom = (vm.custom === true) ? 5000 : 0

    var cost = {
        cpu: cpu,
        memory: memory,
        disk: disk,
        os: os,
        mw: mw,
        itcam: itcam,
        puppet: puppet,
        baseCost: baseCost,
        custom: custom
    }

    cost.srm = (vm.srm) ? _.values(cost).reduce(summarize, 0) : 0
    cost.total = _.values(cost).reduce(summarize, 0)

    for (var key in cost) {
        vm['cost_' + key] = cost[key]
    }

    return vm
}

module.exports = calculateCost
