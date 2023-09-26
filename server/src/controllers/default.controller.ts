import { DefaultService } from '@services/default.service';
import {
  DefaultInterface,
  ICreateRequest,
  IResponseBody,
} from '@app/interfaces';
import { Container } from 'typedi';
import { NextFunction, Request, Response } from 'express';

export class DefaultController {
  public service = Container.get(DefaultService);

  public getData = async (
    req: Request,
    res: Response<IResponseBody<DefaultInterface[]>>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = await this.service.findAll();

      res.status(200).send({ data, message: 'success' });
    } catch (err) {
      next(err);
    }
  };

  public createData = async (
    { body }: ICreateRequest<DefaultInterface>,
    res: Response<IResponseBody<DefaultInterface>>,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const createData: DefaultInterface = await this.service.create(body);

      res
        .status(201)
        .json({ data: createData, message: 'created successfully' });
    } catch (error) {
      next(error);
    }
  };
}
