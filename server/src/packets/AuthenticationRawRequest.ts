import { LooseObject } from "trilogy";
import { WebsocketMessage, generateToken } from ".";
import { WebsocketConnection } from "../connection";
import { tokens, users } from "../db";
import { InvalidAuthenticationRequest } from "./responses/InvalidAuthenticationRequest";
import { SuccessfulAuthentication } from "./responses/SuccessfulAuthentication";

export class AuthenticationRawRequest extends WebsocketMessage {
  private readonly username: string;
  private readonly password: string;
  constructor(data: { username: string, password: string; }) {
    super({
      id: "authentication-raw-request",
      ...data
    });
    this.username = data.username;
    this.password = data.password;
  }

  public override async manageMessage(connection: WebsocketConnection): Promise<void> {
    try {
      const userData = await users.findOne({ username: this.username, password: this.password }) as LooseObject;
      if (!userData) {
        throw new Error("Invalid username or password.");
      }

      connection.setUserID(userData["id"]);
      connection.log("Authenticated user: " + userData.username);

      // Generate new token.
      const token: string = await generateToken();
      await tokens.updateOrCreate({ userID: userData["id"] }, { token });

      connection.send(new SuccessfulAuthentication({ token }));
    } catch (error: any) {
      connection.log("Error in AuthenticationRawRequest: " + error.message);
      connection.send(new InvalidAuthenticationRequest({ reason: error.message }));
    }
  }
}