import { Injectable } from "@nestjs/common";
import { FastifyRequest, RouteGenericInterface, RawServerDefault, FastifySchema, FastifyTypeProviderDefault, FastifyBaseLogger, FastifyReply } from "fastify";
import { ResolveFastifyRequestType } from "fastify/types/type-provider";
import { IncomingMessage, ServerResponse } from "node:http";
import { InitiateSamlLoginRequest } from "../../controllers/auth/vo/saml.dto";


@Injectable()
export class SamlService {
  generateMetadata(samlConfigurationId: string, req: FastifyRequest<RouteGenericInterface, RawServerDefault, IncomingMessage, FastifySchema, FastifyTypeProviderDefault, unknown, FastifyBaseLogger, ResolveFastifyRequestType<FastifyTypeProviderDefault, FastifySchema, RouteGenericInterface>>, res: FastifyReply<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, RouteGenericInterface, unknown, FastifySchema, FastifyTypeProviderDefault, unknown>) {
    throw new Error('Method not implemented.');
  }
  login(request: InitiateSamlLoginRequest, req: FastifyRequest<RouteGenericInterface, RawServerDefault, IncomingMessage, FastifySchema, FastifyTypeProviderDefault, unknown, FastifyBaseLogger, ResolveFastifyRequestType<FastifyTypeProviderDefault, FastifySchema, RouteGenericInterface>>, res: FastifyReply<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, RouteGenericInterface, unknown, FastifySchema, FastifyTypeProviderDefault, unknown>, arg3: { tenantId: string; redirectUrl: string; samlConfigurationId: string; }) {
    throw new Error('Method not implemented.');
  }

}
