import mongoose from "mongoose";

interface IUser {
  username: string;
  name: string;
  passwordHash: string; 
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true }, 
  passwordHash: { type: String, required: true }, 
});

userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    if (ret.passwordHash) delete ret.passwordHash; 
    return ret;
  }
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
