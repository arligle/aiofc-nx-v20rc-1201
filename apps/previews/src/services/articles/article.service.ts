import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '@aiofc/service-base';
import { Article } from '../../database/entities';
import { ClsService, ClsStore } from 'nestjs-cls';
import { ArticleRepository } from '../../repositories/articles/article.repository';

@Injectable()
export class ArticleService extends BaseEntityService<
  Article,
  'id',
  ArticleRepository
> {
  constructor(
    repository: ArticleRepository,
    private readonly clsService: ClsService<ClsStore>
  ) {
    super(repository);
  }

  async createArticle(title: string, author: string, summary: string) {
    // return this.findAll();
    const article = new Article();
    article.title = title;
    article.author = author;
    article.summary = summary;
    article.isActive = true;
    return this.create(article);
  }

  // async findAll() {
  //   return this.findAll();
  // }
}
