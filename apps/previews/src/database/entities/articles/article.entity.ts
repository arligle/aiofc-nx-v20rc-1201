import { AbstractBaseTrackedEntity } from "@aiofc/typeorm";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity('articles')
export class Article extends AbstractBaseTrackedEntity
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    author: string;

    @Column()
    summary: string;

    @Column()
    isActive: boolean;
}