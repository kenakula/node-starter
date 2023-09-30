import { Document, Model, model, Schema } from 'mongoose';
import validator from 'validator';
import crypto from 'crypto';
import { IUser, IUserSchemaMethods } from '@shared/interfaces';
import { compare, genSalt, hash } from 'bcryptjs';
import { PASSWORD_HASH_SALT } from '@app/configs';

const PASS_RESET_EXPIRES_IN = 60 * 1000 * 10;

type TUserModel = Model<IUser, {}, IUserSchemaMethods>;

const userSchema: Schema<IUser, TUserModel, IUserSchemaMethods> = new Schema(
  {
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
      enum: {
        values: ['user', 'admin'],
        message: `{VALUE} is not supported; Supported roles: user, admin`,
      },
      default: 'user',
    },
    emailConfirmToken: {
      type: String,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

userSchema.methods.createEmailConfirmToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailConfirmToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return token;
};

userSchema.methods.isPasswordCorrect = async function (
  candidate,
  userPassword,
): Promise<boolean> {
  return await compare(candidate, userPassword);
};

userSchema.methods.changedPasswordAfter = function (
  timestamp: number,
): boolean {
  if (!this.passwordChangedAt) {
    return false;
  }

  return timestamp < this.passwordChangedAt.getTime();
};

userSchema.methods.createPasswordResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + PASS_RESET_EXPIRES_IN;

  return resetToken;
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const hashSalt = await genSalt(Number(PASSWORD_HASH_SALT));
  this.password = await hash(this.password, hashSalt);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }

  this.passwordChangedAt = new Date();
});

export const UserModel = model<IUser & Document, TUserModel>(
  'User',
  userSchema,
);
