import { Service } from 'typedi';
import { IUser } from '@app/interfaces';
import { UserModel } from '@models/user.model';

@Service()
export class UserService {
  public async findAll(): Promise<IUser[]> {
    const data: IUser[] = await UserModel.find();

    return data;
  }

  public async create(data: IUser): Promise<IUser> {
    const newUser: IUser = await UserModel.create<IUser>(data);

    return newUser;
  }
}
