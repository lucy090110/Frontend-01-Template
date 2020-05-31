const net = require('net');
const parser=require('./parser')
class Request {
  constructor(options) {
    options = options || {};

    this.method = options.method || 'GET';
    this.path = options.path || '/';
    this.port = options.port || 80;
    this.body = options.body || {};
    this.headers = options.headers || {};

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyContent = Object.keys(this.body)
        .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
        .join('&');
    } else if (this.headers['Content-Type'] === 'application/json') {
      this.bodyContent = JSON.stringify(this.body);
    }

    this.headers['Content-Length'] = this.bodyContent.length;
  }

  get requestText() {
    return [
      `${this.method} ${this.path} HTTP/1.1`,
      `${Object.keys(this.headers)
        .map((key) => `${key}: ${this.headers[key]}`)
        .join('\r\n')}`,
      '',
      `${this.bodyContent}`,
    ].join('\r\n');
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parserP = new ResponseParse();
      if (connection) {
        connection.write(this.requestText);
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.requestText);
          }
        );
      }

      connection.on('data', (data) => {
        parserP.receive(data.toString());
        if (parserP.isFinished) {
          resolve(parserP.response);
          connection.end();
        }
      });

      connection.on('error', (err) => {
        reject(err);
        connection.end();
      });

      connection.on('end', () => {
        console.log('disconnected from server');
      });
    });
  }
}

class ResponseParse {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEARDER_NAME = 2;
    this.WAITING_HEARDER_SPACE = 3;
    this.WAITING_HEARDER_VALUE = 4;
    this.WAITING_HEARDER_LINE_END = 5;
    this.WAITING_HEARDER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.currentStatus = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.hearderName = '';
    this.hearderValue = '';

    this.bodyParser = null;
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 (\d+) ([\s\S]+)/);

    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(''),
    };
  }

  receive(str) {
    for (const c of [...str]) {
      if (this.isFinished) break;
      this.receiveChar(c);
    }
  }

  receiveChar(char) {
    if (this.currentStatus === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.currentStatus = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.currentStatus === this.WAITING_STATUS_LINE_END) {
      if (char === '\n') {
        this.currentStatus = this.WAITING_HEARDER_NAME;
      }
    } else if (this.currentStatus === this.WAITING_HEARDER_NAME) {
      if (char === ':') {
        this.currentStatus = this.WAITING_HEARDER_SPACE;
      } else if (char === '\r') {
        this.currentStatus = this.WAITING_HEARDER_BLOCK_END;
      } else {
        this.hearderName += char;
      }
    } else if (this.currentStatus === this.WAITING_HEARDER_SPACE) {
      if (char === ' ') {
        this.currentStatus = this.WAITING_HEARDER_VALUE;
      }
    } else if (this.currentStatus === this.WAITING_HEARDER_VALUE) {
      if (char === '\r') {
        this.currentStatus = this.WAITING_HEARDER_LINE_END;
        this.headers[this.hearderName] = this.hearderValue;
        this.hearderName = '';
        this.hearderValue = '';
      } else {
        this.hearderValue += char;
      }
    } else if (this.currentStatus === this.WAITING_HEARDER_LINE_END) {
      if (char === '\n') {
        this.currentStatus = this.WAITING_HEARDER_NAME;
      }
    } else if (this.currentStatus === this.WAITING_HEARDER_BLOCK_END) {
      if (char === '\n') {
        this.currentStatus = this.WAITING_BODY;

        if (this.headers['Transfer-Encoding'] === 'chunked') {
          this.bodyParser = new ChunkedBodyParser();
        }
      }
    } else if (this.currentStatus === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
}

class ChunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_CHUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;

    this.length = 0;
    this.content = [];
    this.isFinished = false;

    this.currentStatus = this.WAITING_LENGTH;
  }

  receiveChar(char) {
    if (this.currentStatus === this.WAITING_LENGTH) {
      if (char === '\r') {
        this.currentStatus = this.WAITING_LENGTH_LINE_END;
      } else {
        this.length *= 16;
        this.length += parseInt(char, 16);
        this.isFinished = this.length === 0;
      }
    } else if (this.currentStatus === this.WAITING_LENGTH_LINE_END) {
      if (char === '\n') {
        this.currentStatus = this.READING_CHUNK;
      }
    } else if (this.currentStatus === this.READING_CHUNK) {
      if (this.length > 0) {
        this.content.push(char);
        this.length--;
      }

      if (this.length === 0) {
        this.currentStatus = this.WAITING_NEW_LINE;
      }
    } else if (this.currentStatus === this.WAITING_NEW_LINE) {
      if (char === '\r') {
        this.currentStatus = this.WAITING_NEW_LINE_END;
      }
    } else if (this.currentStatus === this.WAITING_NEW_LINE_END) {
      if (char === '\n') {
        this.currentStatus = this.WAITING_LENGTH;
      }
    }
  }
}

void (async function () {
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: '8088',
    headers: {
      'X-foo2': 'bar'
    },
    body: {
      name: 'nohc',
    },
  });

  let response = await request.send();
  let dom=parser.parseHTML(response.body);
//   console.log(response.body);
})();
