import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToMany, ManyToOne, JoinTable } from "typeorm";
import { JoinAttribute } from "typeorm/query-builder/JoinAttribute";
import { Post } from "./Post";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 40, unique: true })
    email!: string;

    @Column({ length: 15, nullable: true })
    nick!: string;

    @Column({ length: 100 })
    password!: string;

    @Column({ length: 10, nullable: true, default: 'local' })
    provider!: string;

    @Column({ length: 30 })
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
