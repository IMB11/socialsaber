import { WebsocketConnection } from "../../connection";
import { WebsocketMessage } from ".";

export class ConnectionAcknowledge extends WebsocketMessage {
  constructor() {
    super({
      id: "connection-acknowledge"
    });
  }

  public async manageMessage(connection: WebsocketConnection): Promise<void> {
    connection.log("Called manageMessage on ConnectionAcknowledge - this doesn't do anything though.");
  }
}
