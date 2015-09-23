import Promise from 'bluebird';
import scripts from './scripts';
import nodeUrl from 'url';
import { profile } from '../config';
import { TARGET } from '../config';

const SUCCESS = 'success';

let page = require('webpage').create();


class Loader {

  constructor (page) {
    this.page = page;
    this.handlers = {};
    this.page.onUrlChanged = (targetUrl) => {
      console.log('onUrlChanged - ', targetUrl);
      return this.checkUrlHandler(targetUrl);
    }
  }

  addHandler (url, handler) {
    this.handlers[url] = handler;
  }

  addHandlerOnce (url, handler) {
    this.handlers[url] = () => {
      handler();
      this.unbindHandler(url);
    };
  }

  unbindHandler (url) {
    this.handlers[url] = null;
  }

  checkUrlHandler (url) {
    let key = nodeUrl.parse(url).path;
    if (this.handlers[key]) {
      return this.handlers[key]();
    }
  }

  open (url) {
    return new Promise((resolve, reject) => {
      return this.page.open(url, (status) => {
        if (status === SUCCESS) return resolve(this.page);
        reject();
      });
    });
  }
}

// page.onResourceRequested = (request) => {
//   console.log('Request >>> ' + JSON.stringify(request, undefined, 4));
// };
// page.onResourceReceived = (response) => {
//   console.log('Receive <<<' + JSON.stringify(response, undefined, 4));
// };

let loader = new Loader(page);

// loader.addHandlerOnce('/match', () => {
//   console.log('Handled home');
//   page.open(`${TARGET}/match`);
// });

// page.open(TARGET, (status) => {
//   if (status === SUCCESS) {
//     console.log('=======');
//     page.evaluateJavaScript(scripts.login());
//     // setTimeout(() => {
//     //   page.render('./screens/example.png');
//     //   phantom.exit();
//     // }, 4000);
//     loader.addHandlerOnce('/home', () => {
//       console.log('Handled home');
//       page.open(`${TARGET}/match`);
//       // page.go('/match');
//     });
//   }
// });

loader.open(TARGET).then((page) => {
  page.evaluateJavaScript(scripts.login());
  loader.addHandlerOnce('/home', () => {
    console.log('Handled home');
    return loader.open(`${TARGET}/match`);
  });
}).then(() => {
  console.log('Match page has been loaded');
});
