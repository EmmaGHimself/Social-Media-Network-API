import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from './user.model';
import { Comment } from './comment.model';

@Table
export class Post extends Model<Post> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;


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


  @HasMany(() => Comment)
  comments: Comment[];
}