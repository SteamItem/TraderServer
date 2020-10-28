function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function setUserId (req, _res, next) {
  if (!req || !req.headers || !req.headers.user) next();
  const user = JSON.parse(req.headers.user);
  req.userId = user.sub;
  next();
}

export default {
  sleep,
  setUserId
}