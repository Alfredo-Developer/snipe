const http = require('http')
const https = require('https')
const tls = require('tls')
const proxyingAgent = require('proxying-agent')

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
    this.agent = proxyingAgent.create('http://df315xn29bx7rpq:rmOt9UNT@152.44.97.146:8000', 'https://api.minecraftservices.com')
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

  connect(connect = function(){}, dataCb = function(data){}) {
    const options = {
      host: 'api.minecraftservices.com',
      port: 443,
      agent: this.agent
    }

    const req = https.request(options, res => {
      this.res = res

      res.on('data', data => dataCb(data.toString()))
    })

    this.req = req

    req.on('socket', socket => {
      this.socket = socket
      connect()
    })

    req.on('error', err => {
      console.error(err)
    })
  }

  send(callback = function(data){}) {
    if(!this.socket || !this.req) return

    this.socket.write(this.payload)

    this.socket.on('data', data => {
      callback(data)
    })
  }

  end(callback = function(){}) {
    this.req.end()
    callback()
  }
}

// const proxy = {
//   host: '152.44.97.146',
//   port: 8000,
//   auth: 'df315xn29bx7rpq:rmOt9UNT'
// }

// const token = `eyJhbGciOiJIUzI1NiJ9.eyJ4dWlkIjoiMjUzNTQ1MjE5ODUyMTIwMyIsImFnZyI6IkFkdWx0Iiwic3ViIjoiM2VlYmU0MDItZDc0MS00NzQxLTk2N2UtZmNmZTBlYmZmMDIzIiwibmJmIjoxNjQ4NjA4Njg2LCJhdXRoIjoiWEJPWCIsInJvbGVzIjpbXSwiaXNzIjoiYXV0aGVudGljYXRpb24iLCJleHAiOjE2NDg2OTUwODYsImlhdCI6MTY0ODYwODY4NiwicGxhdGZvcm0iOiJVTktOT1dOIiwieXVpZCI6ImY0YjRjZjJlYjFkY2Y0YjRlZDgwYWQ0ZmFhMDRlZmM1In0.W80lnaJkZdOL3vMLzukdnyc0dddxX59Ot3dk7cL-anc`
// const socket = new Socket('POST', 'api.minecraftservices.com', 'api.minecraftservices.com', '/minecraft/profile', {'profileName': 'test'}, {'Authorization': `Bearer ${token}`, 'Accept': 'application/json'}, proxy)

// socket.connect(() => {
//   console.log(`created socket connection`)
//   socket.send()
// }, data => {
//   console.log('received data')
//   console.log(`Status Code: ${socket.res.statusCode}`)
//   console.log(data.toString())
// })

// socket.end()

module.exports = Socket