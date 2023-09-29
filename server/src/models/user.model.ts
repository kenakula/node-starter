import { Document, model, Schema } from 'mongoose';
import { IUser } from '@app/interfaces';

const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    minLength: [2, 'User name must have min 2 chars'],
    maxlength: [40, 'User name must have max 40 chars'],
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
});

export const UserModel = model<IUser & Document>('User', UserSchema);
