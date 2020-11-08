import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Hashtag from './Hashtag';
import User from './User';

@Entity()
export default class Post {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 140 })
  content!: string;

  @Column({ length: 200, nullable: true })
  img!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date;

  @ManyToOne(() => User, (user) => user.posts, { nullable: false })
  user!: User;

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.posts)
  @JoinTable({
    name: 'PostHashtag',
    joinColumn: { name: 'postId' },
    inverseJoinColumn: { name: 'hashtagId' },
  })
  hashtags!: Hashtag[];
}
