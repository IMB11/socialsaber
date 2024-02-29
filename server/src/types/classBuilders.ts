import * as WSC from "./websocket";

export class ClassBuilder {
  public static fetchClass(id: string, obj: any): WSC.WebsocketMessage | undefined {
    switch (id) {
      case 'connection-acknowledge':
        return new WSC.ConnectionAcknowledge();
      case 'authentication-request':
        return new WSC.AuthenticationRequest(obj.token);
      case 'new-account-request':
        return new WSC.NewAccountRequest(obj.username, obj.password);
      default:
        return undefined;
    }
  }
}