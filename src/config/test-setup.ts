import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/user.model';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';
import databaseConfig from './database.config';

export const setupTestDatabase = async () => {
    const sequelize = new Sequelize(databaseConfig.test);

    sequelize.addModels([User, Post, Comment]);

    // This line creates the tables in the test database
    await sequelize.sync({ force: true });

    return sequelize;
};
