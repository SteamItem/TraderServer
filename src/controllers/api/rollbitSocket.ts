import * as WebSocket from "ws";

export class RollbitSocket {
  channels = new Map();
  socket: WebSocket = null;
  connected = false;
  queue = [];
  inflight = new Map();
  listen (ch: string, listener) {
    var chs = this.channels.get(ch)
    if (chs == null) {
      chs = []
      this.channels.set(ch, chs)
    }
    chs.push(listener)

    return function () {
      var idx = chs.indexOf(listener)
      if (idx < 0) return
      chs.splice(idx, 1)
    }
  }
  public connect() {
    if (this.socket) return;
    // var socket = new WebSocket(`${"wss://ws.rollbit.com"}/`, { maxTimeout: 1000 * 5 });
    const url = 'wss://ws.rollbit.com/';
    const options: WebSocket.ClientOptions = {
      origin: 'https://www.rollbit.com'
    };
    this.socket = new WebSocket(url, options);
    this.socket.onmessage = this.onmessage
    this.socket.onopen = this.onopen
    this.socket.onclose = this.onclose
  }
  private onopen() {
    this.connected = true
    // while (this.queue.length) this.socket.send(this.queue.shift())
  }
  private onclose() {
    this.connected = false
  }
  private onmessage(ev: WebSocket.MessageEvent) {
    // const [ch, message, id] = JSON.parse(ev.data)
    const [ch, message, id] = JSON.parse(ev.data.toString());
    var listeners = this.channels.get(ch)
    if (listeners && listeners.length) listeners.forEach(l => l(message))
  }
  public send(ch: string, message: string, immediate = false) {
    if (this.socket == null) this.connect()
    var id = Math.random().toString(36)
    const payload = JSON.stringify([ch, message, id])
    const isConnected = this.socket.readyState === 1
    if (immediate && !isConnected) return
    if (!isConnected) return this.queue.push(payload)
    this.socket.send(payload)
  }
}