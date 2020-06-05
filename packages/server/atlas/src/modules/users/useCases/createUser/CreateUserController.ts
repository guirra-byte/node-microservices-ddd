import BaseController from '@core/infra/BaseController';
import * as CreateUserErrors from './CreateUserErrors';

import CreateUserUseCase from './CreateUserUseCase';
import ICreateUserDTO from './ICreateUserDTO';

export default class CreateUserController extends BaseController {
  private useCase: CreateUserUseCase;

  constructor(useCase: CreateUserUseCase) {
    super();

    this.useCase = useCase;
  }

  protected async executeImpl(): Promise<any> {
    const dto = this.request.body as ICreateUserDTO;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateUserErrors.AccountAlreadyExists:
            return this.conflict(error.errorValue().message);
          default:
            return this.fail(error.errorValue().message);
        }
      } else {
        return this.created(this.response);
      }
    } catch (err) {
      return this.fail(err);
    }
  }
}
