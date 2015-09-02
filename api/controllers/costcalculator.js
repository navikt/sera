var _ = require('lodash')

var calcOsCost = function (osType, environmentClass) {
    if (osType === 'rhel') {
        if (environmentClass === 'p') {
            return 159;
        } else {
            return 236;
        }
    } else if (osType === 'windows') {
        return 10000;
    }
}

var calcMWCost = function (type, environmentClass) {
    if (type === 'jboss') {
        return 138
    } else if (type === 'was' || type === 'bpm') {
        return 138
    } else {
        return 0
    }
}

var calcBaseCost = function (osType) {
    if (osType === 'rhel') {
        return 700
    } else if (osType === 'windows') {
        return 500
    } else {
        return 0;
    }
}

var calcITCAMCost = function (type, environment) {
    if (_.startsWith(type, 'was') || _.startsWith(type, 'bpm')) {
        var itcamEnvironments = ['q0', 'q1', 'q3', 't3']
        if (environment === 'p') {
            return 17839
        } else if (_.contains(itcamEnvironments, environment)) {
            return 10233
        }
    } else {
        return 0
    }
}

var summarize = function (total, num) {
    return total + num
};

var calculateCost = function (vm) {
    var cpu = 100 * vm.cpu
    var memory = 400 * vm.memory
    var disk = 32 * vm.disk
    var os = calcOsCost(vm.os, vm.environmentClass)
    var mw = calcMWCost(vm.type, vm.environmentClass)
    var baseCost = calcBaseCost(vm.os)
    var itcam = calcITCAMCost(vm.type, vm.environment)

    vm.cost = {
        cpu: cpu,
        memory: memory,
        disk: disk,
        os: os,
        mw: mw,
        itcam: itcam,
        baseCost: baseCost
    }

    if (vm.custom === true){
        vm.cost.custom = 5000
    }

    vm.cost.total = _.values(vm.cost).reduce(summarize, 0)

    return vm
}

module.exports = calculateCost