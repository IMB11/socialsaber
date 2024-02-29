import { WebsocketConnection } from "../connection";
import { db } from "../db";

declare type LooseObject = Record<string, any>;

export abstract class WebsocketMessage {
  public id: string;
  constructor(_id: string) {
    this.id = _id;
  }

  public toJSON() {
    return JSON.stringify({
      id: this.id
    });
  }

  public abstract manageMessage(connection: WebsocketConnection): void;
}

export class ConnectionAcknowledge extends WebsocketMessage {
  constructor() {
    super('connection-acknowledge');
  }

  public manageMessage(connection: WebsocketConnection): void {
    console.log("This class isn't meant to be used for managing messages.");
  }
}

export class AuthenticationRequest extends WebsocketMessage {
  public token: string;
  constructor(_token: string) {
    super('authentication-request');

    this.token = _token;
  }

  public toJSON() {
    return JSON.stringify({
      id: this.id,
      token: this.token
    });
  }

  public manageMessage(connection: WebsocketConnection): void {
    db.get('tokens', { token: this.token }).then((tokenData) => {
      if (tokenData === undefined) {
        connection.log("Token not found.");
        return;
      }

      connection.setUserID((tokenData as LooseObject)["userID"]);

      const userData = connection.getUserData();
      connection.log("Authenticated user: " + (userData as LooseObject)["username"]);
    });
  }
}

export class NewAccountRequest extends WebsocketMessage {
  public username: string;
  public password: string;
  constructor(_username: string, _password: string) {
    super('new-account-request');

    this.username = _username;
    this.password = _password;
  }

  public toJSON() {
    return JSON.stringify({
      id: this.id,
      username: this.username,
      password: this.password
    });
  }

  public manageMessage(connection: WebsocketConnection): void {
    db.find('users', { username: this.username }).then((userData) => {
      if (userData !== undefined) {
        connection.log("User already exists.");
        return;
      }

      db.create('users', { username: this.username, password: this.password }).then((newUserData: LooseObject) => {
        connection.log("New user created: " + this.username);
      });
    });
  }
}