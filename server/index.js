const express = require('express');
const detect = require('detect-port');
const path = require('path');

const router = express.Router();
router.get('/', (req, res) => {
  res.send('hello three-particle!');
});

const app = express();

// 静态资源地址
const staticPath = path.resolve(__dirname, '../');
app.use(express.static(staticPath));
// 路由
app.use('/', router);

detect(1234).then((port) => {
  app.listen(port);
});
