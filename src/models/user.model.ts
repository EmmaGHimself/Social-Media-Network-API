import { Table, Column, DataType, Model, HasMany } from 'sequelize-typescript';
import { Post } from './post.model';
import { Comment } from './comment.model';

@Table
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @HasMany(() => Post)
  posts: Post[];

  @HasMany(() => Comment)
  comments: Comment[];
}
