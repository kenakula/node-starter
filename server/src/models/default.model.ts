import { DefaultInterface } from '@app/interfaces';
import { Document, model, Schema } from 'mongoose';

const DefaultSchema: Schema = new Schema({
  isActive: Boolean,
  name: {
    type: String,
    unique: true,
    required: [true, 'A Default must have a name'],
    maxLength: [40, 'Maximum name length is 40 chars'],
  },
  date: Date,
});

export const DefaultModel = model<DefaultInterface & Document>(
  'Default',
  DefaultSchema,
);
