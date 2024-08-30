import { UserEntity } from "src/user/entities/user.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp, UpdateDateColumn } from "typeorm"

@Entity('post')
export class PostEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    image: string

    @Column({nullable:true, length: 250})
    caption: string

    @Column({nullable: true, length: 40})
    geoLocationOfPost: string

    @CreateDateColumn()
    createdAt: Timestamp

    @UpdateDateColumn()
    updatedAt: Timestamp

    @Column("json", {default: []})
    comments: Array<ComDto>

    @Column("json", {default: []})
    likes: string[]

    @JoinColumn()
    @ManyToOne(type => UserEntity, user => user.posts)
    user: UserEntity
}

class ComDto {
    id: string
    comment: string
    email: string
}