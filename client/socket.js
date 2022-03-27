const http = require('http')
const tls = require('tls')

class Socket {
  constructor(method, host, endpointHost, path, json, headers, proxy = {}) {
    this.method = method
    this.host = host
    this.endpointHost = endpointHost
    this.path = path
    this.json = JSON.stringify(json)
    this.headers = headers,
    this.proxy = proxy
    this.contentType = 'application/json'

    this.createPayload()
  }

  createPayload() {
    let payload = `${this.method} ${this.path} HTTP/1.1\r\nHost: ${this.endpointHost}\r\nContent-Type: ${this.contentType}\r\n`
    payload += `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.101 Safari/537.36\r\nContent-Length: ${this.json.length}\r\n`
    payload += `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9\r\n`
    payload += "Connection: keep-alive\r\nAccept-Language: en-GB,en-US;q=0.9,en;q=0.8\r\nAccept-Encoding: gzip, deflate, br\r\n"
    payload += `Referer: https://google.com/\r\nOrigin: https://${this.host}\r\n`
    for(let header in this.headers) {
      payload += `${header}: ${this.headers[header]}\r\n`
    }
    payload += `\r\n`
    payload += this.json

    this.payload = payload
  }

  connect(callback = function(){}) {
    this.req = http.request({
      host: this.proxy.host,
      port: this.proxy.port,
      method: 'CONNECT',
      path: `${this.host}:443`
    })

    this.req.on('connect', (res, socket, head) => {
      this.socket = socket
      this.conn = tls.connect({
        host: this.endpointHost,
        servername: this.host,
        socket: this.socket,
        rejectUnauthorized: false
      }, () => {
        callback(true)
      })
    })
  }

  send(callback = function(data){}) {
    if(!this.conn || !this.payload) return

    this.conn.write(this.payload)
    this.conn.on('data', data => {
      this.responseData = data
      callback(data)
    })
  }

  end(callback = function(){}) {
    this.req.end()
    callback()
  }

  getStatusCode(callback = function(err){}) {
    if(!this.responseData) {
      callback('Data is undefined')
      return 0
    }

    let line = this.responseData.toString().split('\n')[0]
    let code = line.replace('HTTP/1.1 ', '').replace('OK', '')
    callback(undefined)
    return parseInt(code) || code
  }
}

module.exports = Socket