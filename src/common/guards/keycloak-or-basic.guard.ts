import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  Type,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';

@Injectable()
export class KeycloakOrBasicGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly moduleRef: ModuleRef,
  ) {}
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const keycloakGuardsRef =
      this.reflector.getAllAndMerge<Type<CanActivate>[]>(
        'keycloakGuardsReferences',
        [context.getHandler(), context.getClass()],
      ) || [];

    if (keycloakGuardsRef.length > 0) {
      const keycloakGuards = keycloakGuardsRef.map((guardReference) =>
        this.moduleRef.get<CanActivate>(guardReference, {
          strict: false,
        }),
      );

      let keycloakGuardIsOk = true;
      for (let i = 0; i < keycloakGuards.length; i++) {
        const canActivate = await (
          keycloakGuards[i].canActivate(context) as Promise<boolean>
        ).catch(() => false);

        if (!canActivate) {
          keycloakGuardIsOk = false;
          break;
        }
      }

      if (keycloakGuardIsOk) {
        return Promise.resolve(true);
      }
    }

    const basicGuardsRef =
      this.reflector.getAllAndMerge<Type<CanActivate>[]>(
        'basicGuardsReferences',
        [context.getHandler(), context.getClass()],
      ) || [];

    if (basicGuardsRef.length == 0) {
      return Promise.resolve(false);
    }

    const basicGuards = basicGuardsRef.map((guardReference) =>
      this.moduleRef.get<CanActivate>(guardReference, {
        strict: false,
      }),
    );

    for (let i = 0; i < basicGuards.length; i++) {
      const canActivate = await (
        basicGuards[i].canActivate(context) as Promise<boolean>
      ).catch(() => false);

      if (canActivate) {
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(false);
  }
}

export const KeycloakGuardsReferences = (...guards: Type<CanActivate>[]) =>
  SetMetadata('keycloakGuardsReferences', guards);

export const BasicGuardsReferences = (...guards: Type<CanActivate>[]) =>
  SetMetadata('basicGuardsReferences', guards);
