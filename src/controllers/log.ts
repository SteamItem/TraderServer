import Log = require('../models/log');

function create(message: string) {
    const log = new Log.default({ message });
    return log.save();
}

export = {
    create
}