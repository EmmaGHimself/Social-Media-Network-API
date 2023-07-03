import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';
import { Post } from './post.model';

@Table
export class Comment extends Model<Comment> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Post)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  postId: number;

  @BelongsTo(() => Post)
  post: Post;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.TEXT,
    get() {
      return JSON.parse(this.getDataValue('likedBy') || '[]') as number[];
    },
    set(value: number[]) {
      this.setDataValue('likedBy', JSON.stringify(value));
    },
    defaultValue: '[]',
  })
  likedBy: number[];
}
