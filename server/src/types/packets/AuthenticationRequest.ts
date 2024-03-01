import { LooseObject } from "trilogy";
import { WebsocketConnection } from "../../connection";
import { tokens } from "../../db";
import { WebsocketMessage } from ".";

export class AuthenticationRequest extends WebsocketMessage {
  public readonly token: string;

  constructor(data: { token: string; }) {
    super({
      id: "authentication-request",
      ...data
    });
    this.token = data.token;
  }

  public async manageMessage(connection: WebsocketConnection): Promise<void> {
    try {
      const tokenData = await tokens.findOne({ token: this.token }) as LooseObject;

      if (!tokenData) {
        connection.log("Token not found.");
        return;
      }

      connection.setUserID(tokenData["userID"]);
      const userData = connection.getUserData();
      connection.log("Authenticated user: " + userData["username"]);

    } catch (error) {
      connection.log("Error in AuthenticationRequest: ");
      connection.log(error as string);
      connection
    }
  }
}
