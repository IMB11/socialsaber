import { LooseObject } from "trilogy";
import { WebsocketConnection } from "../connection";
import { users, tokens } from "../db";
import { WebsocketMessage, generateToken } from ".";
import { SuccessfulAuthentication } from "./responses/SuccessfulAuthentication";
import { InvalidNewAccountRequest } from "./responses/InvalidNewAccountRequest";

export class NewAccountRequest extends WebsocketMessage {
  public readonly username: string;
  public readonly password: string;

  constructor(data: { username: string; password: string; }) {
    super({
      id: "new-account-request",
      ...data
    });
    this.username = data.username;
    this.password = data.password;
  }

  public async manageMessage(connection: WebsocketConnection): Promise<void> {
    try {
      const existingUser = await users.findOne({ username: this.username }) as LooseObject;

      if (existingUser) {
        throw new Error("User already exists.");
      }

      const userData = await users.create({
        username: this.username,
        password: this.password
      }) as LooseObject;

      connection.setUserID(userData["id"]);

      connection.log("New user created: " + this.username);

      // Create new token and send it to the user.
      const token = await tokens.create({ userID: userData["id"], token: await generateToken() }) as LooseObject;

      connection.send(new SuccessfulAuthentication({ token: token["token"] }));

    } catch (error: any) {
      connection.log("Error in NewAccountRequest: " + error.message);
      connection.send(new InvalidNewAccountRequest({ reason: error.message }));
    }
  }
}
