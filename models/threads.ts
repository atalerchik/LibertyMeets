import {
  Table,
  Column,
  DataType,
  AllowNull,
  Model,
  Default,
  PrimaryKey,
  CreatedAt,
  ForeignKey,
  HasOne,
  HasMany,
  DeletedAt,
} from "sequelize-typescript";
import { v4 } from "uuid";
import { Posts } from "./posts";
import { ThreadMessages } from "./threadMessages";
import { Users } from "./users";

@Table({
  timestamps: false,
  paranoid: true,
  underscored: true,
  tableName: "threads",
  initialAutoIncrement: "1",
})
export class Threads extends Model {
  @PrimaryKey
  @Default(v4)
  @Column(DataType.UUIDV4)
  id!: string;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  @ForeignKey(() => Users)
  user_id!: number;

  @AllowNull(false)
  @Column(DataType.NUMBER)
  @ForeignKey(() => Posts)
  post_id!: number;

  @CreatedAt
  @Column
  createdAt!: Date;

  @DeletedAt
  @Column
  deletedAt!: Date;

//@HasOne(() => Posts)
  //post?: Posts;

  //@HasMany(() => ThreadMessages, { foreignKey: "thread_id" })
  //threadMessages?: ThreadMessages[];
}
