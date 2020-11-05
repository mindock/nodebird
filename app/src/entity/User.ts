import { Entity, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, BaseEntity } from "typeorm";
import { Post } from "./Post";

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 40, unique: true, nullable: true })
    email!: string;

    @Column({ length: 15 })
    nick!: string;

    @Column({ length: 100, nullable: true })
    password!: string;

    @Column({ length: 10, default: 'local' })
    provider!: string;

    @Column({ length: 30, nullable: true })
    snsId!: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt!: Date;

    @OneToMany(type => Post, post => post.user)
    posts!: Post[];

    @ManyToMany(type => User, user => user.followers)
    followings!: User[];

    @ManyToMany(type => User, user => user.followings)
    @JoinTable({
        name: 'Follow',
        joinColumn: { name: 'followingId' },
        inverseJoinColumn: { name: 'followerId' }
    })
    followers!: User[];
}
