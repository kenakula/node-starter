import { Service } from 'typedi';
import { IUser } from '@app/interfaces';
import { UserModel } from '@models/user.model';
import { HttpException } from '@app/exceptions';

@Service()
export class UserService {
  public async getUsers(): Promise<IUser[]> {
    const data: IUser[] = await UserModel.find();

    return data;
  }

  public async getUser(id: string): Promise<IUser> {
    const data: IUser = await UserModel.findById(id);

    return data;
  }

  public async createUser(data: IUser): Promise<IUser> {
    const newUser: IUser = await UserModel.create<IUser>(data);

    return newUser;
  }

  public async updateUser(id: string, patch: Partial<IUser>): Promise<IUser> {
    const user = await UserModel.findByIdAndUpdate(id, patch, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new HttpException(404, 'no user found to update');
    }

    return user;
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await UserModel.findByIdAndRemove(id);

    if (!user) {
      throw new HttpException(404, 'no user found to update');
    }
  }
}
