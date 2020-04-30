import Log = require('../models/log');

function create(site: string, bot: string, message: string) {
    const log = new Log.default({ site, bot, message });
    return log.save();
}

async function findLastTen(site: string) {
    return Log.default.find({site}).sort({_id:-1}).limit(10);
}

async function deleteAll() {
    return Log.default.deleteMany({});
}

export = {
    create,
    findLastTen,
    deleteAll
}