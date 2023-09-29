import { Service } from 'typedi';
import { IUser } from '@shared/interfaces';
import { UserModel } from '@app/models';
import { HttpException } from '@app/exceptions';
import { HttpStatusCode } from '@shared/enums';

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
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'No user found to update',
      );
    }

    return user;
  }

  public async deleteUser(id: string): Promise<void> {
    const user = await UserModel.findByIdAndRemove(id);

    if (!user) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        'No user found to delete',
      );
    }
  }
}
