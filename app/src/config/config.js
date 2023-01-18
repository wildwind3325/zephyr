var config = {
  secret: '2ee06c48087b66a4',
  token_name: 'sid:zephyr',
  app_id: 'cli_a2baf5cbf238100c',
  app_secret: 'riWYmxzJaH3386etZ8uCdcIacRh1HiMd'
};

if (process.env.NODE_ENV === 'QAS') {
} else if (process.env.NODE_ENV === 'PRD') {
}

module.exports = config;