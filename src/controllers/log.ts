import Log = require('../models/log');

function create(site: string, message: string) {
    const log = new Log.default({ site, message });
    return log.save();
}

async function findLastTen(env: string) {
    return Log.default.find({env}).sort({_id:-1}).limit(10);
}

async function deleteAll() {
    return Log.default.deleteMany({});
}

export = {
    create,
    findLastTen,
    deleteAll
}