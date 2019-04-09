import showdown from 'showdown';
import xss from 'xss';


// 从 webpack 诸如 markdown 文件
const markdownCN = markdownFileStringPlaceholderCN;
const markdownEN = markdownFileStringPlaceholderEN;

const converter = new showdown.Converter();
converter.setFlavor('github');

let html = '';

const app = document.getElementById('app');
const languageSelectEl = document.getElementById('language-select');

function languageSelectChangeHandler(event){
  switch (languageSelectEl.value) {
    case '0': {
      html = converter.makeHtml(markdownCN);
      break;
    }
    case '1': {
      html = converter.makeHtml(markdownEN);
      break;
    }
  }
  app.innerHTML = xss(html);
}

languageSelectChangeHandler();

languageSelectEl.onchange = languageSelectChangeHandler;