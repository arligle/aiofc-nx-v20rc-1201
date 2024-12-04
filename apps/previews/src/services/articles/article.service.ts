import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '@aiofc/service-base';
import { Article } from '../../database/entities';
import { ArticleRepository } from '../../repositories/articles/article.repository';
import { ClsService, ClsStore } from '@aiofc/nestjs-cls';
import { faker } from '@faker-js/faker/.';

@Injectable()
export class ArticleService extends BaseEntityService<
  Article,
  'id',
  ArticleRepository
> {
  constructor(
    repository: ArticleRepository,
    private readonly cls: ClsService<ClsStore>
  ) {
    super(repository);
  }

  async createArticle(title: string, author: string, summary: string) {
    const article = new Article();
    article.title = title;
    article.author = author;
    article.summary = summary;
    article.isActive = true;
    // 测试clsService是否能够获取到cls中的requestId
    const requestId = this.cls.get('requestId');
    console.log(`本次请求的ID已经在cls缓存：${requestId}`);

    return this.create(article);
  }

  async newArticle(){
    const article = new Article();
    article.title = faker.word.words();
    article.author = faker.person.fullName();
    article.summary = faker.word.sample();
    article.isActive = true;
    return this.create(article);
  }

}
