import { LooseObject } from "trilogy";
import { WebsocketConnection } from "../../connection";
import { users } from "../../db";
import { WebsocketMessage } from ".";


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
        connection.log("User already exists.");
        return;
      }

      await users.create({
        username: this.username,
        password: this.password
      });

      connection.log("New user created: " + this.username);

    } catch (error) {
      connection.log("Error in NewAccountRequest: ");
      connection.log(error as string);
      // Handle the error appropriately (e.g., send error back to the client)
    }
  }
}
