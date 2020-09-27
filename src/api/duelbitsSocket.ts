import io from 'socket.io-client';
import { IDuelbitsUserBase, IDuelbitsWithdrawResponse } from '../interfaces/duelbits';

export class DuelbitsSocket {
  public socket: SocketIOClient.Socket;
  private user: IDuelbitsUserBase;

  private get connected(): boolean {
    return this.socket && this.socket.connected;
  }

  public async connect(): Promise<SocketIOClient.Socket> {
    if (this.connected) return this.socket;
    this.socket = io.connect('https://ws.duelbits.com', {transports: ['websocket'], upgrade: false});
    return this.socket;
  }

  public disconnect(): SocketIOClient.Socket {
    if (!this.connected) return this.socket;
    return this.socket.disconnect();
  }

  public withdraw(id: string, callback: (e: Error, t: IDuelbitsWithdrawResponse) => void): void {
    const withdrawRequest = {tradeUrl: this.user.tradeUrl, id}
    this.socket.emit('p2p:join', withdrawRequest, callback);
  }
}