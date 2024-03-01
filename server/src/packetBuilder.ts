import { WebsocketMessage } from "./packets";
import { AuthenticationTokenRequest } from "./packets/AuthenticationTokenRequest";
import { ConnectionAcknowledge } from "./packets/ConnectionAcknowledge";
import { NewAccountRequest } from "./packets/NewAccountRequest";
import { TextMessage } from "./packets/TextMessage";

interface MessageConstructor {
  new(data: any): WebsocketMessage;
}

const messageRegistry: Record<string, MessageConstructor> = {
  'connection-acknowledge': ConnectionAcknowledge,
  'authentication-token-request': AuthenticationTokenRequest,
  'new-account-request': NewAccountRequest,
  'text-message': TextMessage,
};

export class ClassBuilder {
  public static fetchClass(id: string, obj: any): WebsocketMessage | undefined {
    const constructor = messageRegistry[id];
    return constructor ? new constructor(obj) : undefined;
  }
}