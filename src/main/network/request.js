import http from 'http';
import https from 'https';

const request = (url) => {
  const $url = new URL(url);

  let fetch = http.request;

  if ($url.protocol === 'https:') {
    fetch = https.get;
  }

  return new Promise((resolve, reject) => {
    const req = fetch($url, (res) => {
      let data = '';

      res.setEncoding('binary');
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => resolve({ status: res.statusCode, data }));

      res.on('error', reject);
    });

    req.on('error', reject);

    req.end();
  });
};

export default request;
