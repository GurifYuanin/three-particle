const express = require('express');
const detect = require('detect-port');
const path = require('path');
const fs = require('fs');
const packageJson = require('../package.json');


const router = express.Router();
router.get('/', (req, res) => {
  const files = fs.readdirSync(path.resolve(__dirname, '../demo'));
  res.send(`
    <body style="overflow: hidden;">
    <!-- from: https://github.blog/2008-12-19-github-ribbons/ -->
    <a href="https://github.com/GurifYuanin/three-particle"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png?resize=149%2C149" alt="Fork me on GitHub"></a>
      <div style="display: flex;
                  justify-content: center;
                  align-content: center;
                  flex-wrap: wrap;
                  text-align: center;
                  width: 100vw;
                  height: 100vh;">
        <h2 style="width: 100%;">Hello ${packageJson.name}!</h2>
        <div style="width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                    text-align: center;">
          ${files
      .filter(file => file.endsWith('.html'))
      .map(file => `<a style="width: 20%; margin: 5px 0;" href="./demo/${file}" style="padding: 0 5px;">${file}</a>`)
      .join('')}
        </div>
      </div>
    </body>
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
