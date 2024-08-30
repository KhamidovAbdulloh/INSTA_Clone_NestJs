import { PostEntity } from "src/post/entities/post.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({unique: true})
    email: string

    @Column()
    password: string

    @Column({unique: true, length: 50})
    username: string

    @Column({nullable: true, length: 80})
    name: string

    @Column({nullable: true})
    avatar: string

    @Column({nullable: true, length: 350})
    bio: string

    @CreateDateColumn()
    createdAt: Timestamp

    @UpdateDateColumn()
    updatedAt: Timestamp

    @Column("json", {default: []})
    followers: string[]

    @Column("json", {default: []})
    following: string[]

    @OneToMany(type => PostEntity, post => post.user)
    posts: PostEntity[]
}
