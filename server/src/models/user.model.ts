import { Document, Model, model, Schema } from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import { IUser, IUserMethods } from '@shared/interfaces';

type TUserModel = Model<IUser, {}, IUserMethods>;

const userSchema: Schema<IUser, TUserModel, IUserMethods> = new Schema({
  name: {
    type: String,
    maxlength: [40, 'User name must have max 40 chars'],
  },
  email: {
    type: String,
    required: [true, 'User must have an email'],
    validate: [validator.isEmail, 'Please enter valid email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minLength: [6, 'Password length is less than 6'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a passwordConfirm'],
    validate: {
      validator: function (val: string): boolean {
        return val === this.password;
      },
      message: 'Passwords does not match',
    },
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  emailConfirmToken: String,
  passwordChangedAt: Date,
  emailConfirmed: {
    type: Boolean,
    default: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.methods.createEmailConfirmToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailConfirmToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return token;
};

export const UserModel = model<IUser & Document, TUserModel>(
  'User',
  userSchema,
);
