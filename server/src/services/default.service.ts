import { Service } from 'typedi';
import { DefaultModel } from '@models/default.model';
import { DefaultInterface } from '@app/interfaces';
import { HttpException } from '@app/exceptions';

@Service()
export class DefaultService {
  public async findAll(): Promise<DefaultInterface[]> {
    const data: DefaultInterface[] = await DefaultModel.find();

    return data;
  }

  public async create(data: DefaultInterface): Promise<DefaultInterface> {
    const { name } = data;
    const findData = await DefaultModel.findOne({ name });

    if (findData) {
      throw new HttpException(400, `This name ${name} already exists`);
    }

    const createUserData: DefaultInterface = await DefaultModel.create({
      ...data,
    });

    return createUserData;
  }
}
