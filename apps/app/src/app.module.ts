import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {CoFService} from './cofservice/cofservice.service';
import {QueryBuilderService} from "./querybuilder/querybuilder.service";

@Module({
    imports: [],
    controllers: [AppController],
    providers: [CoFService, QueryBuilderService],
})
export class AppModule {
}
