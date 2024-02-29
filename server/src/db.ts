import { connect } from 'trilogy';

export const db = connect('../db.sqlite3');

export const users = await db.model('users', {
  username: String,
  password: String,
  id: 'increments'
});

export const messages = await db.model('messages', {
  userID: Number,
  timestamp: Date,
  message: String,
  id: 'increments'
});

export const tokens = await db.model('tokens', {
  token: String,
  userID: Number,
})