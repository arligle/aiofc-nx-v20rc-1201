
import { fastifySwaggerBootstrap } from "@aiofc/fastify-server";
import { AppModule } from "./app/app.module";

fastifySwaggerBootstrap(AppModule);