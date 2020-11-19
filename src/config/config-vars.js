const CONFIG_DATA = {
  DEV_PORT: 3001,
  MONGO_URI: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s4839.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
};

module.exports = CONFIG_DATA;
