import { LooseObject } from "trilogy";
import { WebsocketConnection } from "../connection";
import { tokens } from "../db";
import { WebsocketMessage } from ".";
import { InvalidAuthenticationRequest } from "./responses/InvalidAuthenticationRequest";
import { SuccessfulAuthentication } from "./responses/SuccessfulAuthentication";

export class AuthenticationTokenRequest extends WebsocketMessage {
  public readonly token: string;

  constructor(data: { token: string; }) {
    super({
      id: "authentication-token-request",
      ...data
    });
    this.token = data.token;
  }

  public override async manageMessage(connection: WebsocketConnection): Promise<void> {
    try {
      const tokenData = await tokens.findOne({ token: this.token }) as LooseObject;

      if (!tokenData) {
        throw new Error("Invalid token.");
      }

      connection.setUserID(tokenData["userID"]);
      const userData = await connection.getUserData();
      connection.log("Authenticated user: " + userData.username);
      connection.send(new SuccessfulAuthentication({ token: this.token }));
    } catch (error: any) {
      connection.log("Error in AuthenticationRequest: " + error.message);
      connection.send(new InvalidAuthenticationRequest({ reason: error.message }));
    }
  }
}
