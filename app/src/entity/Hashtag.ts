import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Post from './Post';

@Entity()
export default class Hashtag {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 15, unique: true })
  title!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @ManyToMany(() => Post, (post) => post.hashtags)
  posts!: Post[];
}
