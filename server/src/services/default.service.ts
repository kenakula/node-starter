import { Service } from 'typedi';
import { DefaultModel } from '@models/default.model';
import { DefaultInterface } from '@app/interfaces';
import { HttpException } from '@app/exceptions';

@Service()
export class DefaultService {
  public async findAll(): Promise<DefaultInterface[]> {
    return DefaultModel;
  }

  public async create(data: DefaultInterface): Promise<DefaultInterface> {
    const { name } = data;
    const findData = DefaultModel.find(item => item.name === name);

    if (findData) {
      throw new HttpException(400, `This name ${name} already exists`);
    }

    return {
      ...data,
      _id: (DefaultModel.length + 1).toString(),
      registered: Date.now().toLocaleString(),
    };
  }
}
