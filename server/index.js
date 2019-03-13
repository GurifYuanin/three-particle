const express = require('express');
const detect = require('detect-port');
const path = require('path');
const fs = require('fs');

const router = express.Router();
router.get('/', (req, res) => {
  const files = fs.readdirSync(path.resolve(__dirname, '../demo'));
  res.send(`
    <div style="display: flex;
                justify-content: center;
                align-content: center;
                flex-wrap: wrap;
                text-align: center;
                width: 100vw;
                height: 100vh;">
      <div style="width: 100%;">hello three-particle!</div>
      <div style="width: 100%;">
        ${files
    .filter(file => file.endsWith('.html'))
    .map(file => `<a href="./demo/${file}" style="padding: 0 5px;">${file}</a>`)
    .join('')}
      </div>
    </div>
  `);
});

const app = express();

// 静态资源地址
const staticPath = path.resolve(__dirname, '../');
app.use(express.static(staticPath));

// 路由
app.use('/', router);

detect(1234).then((port) => {
  app.listen(port);
  console.clear();
  console.log(' ---------------------------------');
  console.log(`|  \x1b[42m\x1b[37m OK \x1b[0m Listen on localhost:${port}  |`);
  console.log(' ---------------------------------');
});
