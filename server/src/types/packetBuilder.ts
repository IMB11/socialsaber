import * as Packets from "./packets";

interface MessageConstructor {
  new(data: any): Packets.WebsocketMessage;
}

const messageRegistry: Record<string, MessageConstructor> = {
  'connection-acknowledge': Packets.ConnectionAcknowledge,
  'authentication-request': Packets.AuthenticationRequest,
  'new-account-request': Packets.NewAccountRequest,
};

export class ClassBuilder {
  public static fetchClass(id: string, obj: any): Packets.WebsocketMessage | undefined {
    const constructor = messageRegistry[id];
    return constructor ? new constructor(obj) : undefined;
  }
}