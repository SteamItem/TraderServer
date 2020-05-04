import Log = require('../models/log');

function create(bot: string, message: string) {
    const log = new Log.default({ bot, message });
    return log.save();
}

async function deleteAll() {
    return Log.default.deleteMany({});
}

export = {
    create,
    deleteAll
}