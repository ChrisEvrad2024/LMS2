import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Lesson = sequelize.define('Lesson', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT
  },
  contentType: {
    type: DataTypes.ENUM('video', 'text', 'quiz', 'file'),
    defaultValue: 'text'
  },
  duration: {
    type: DataTypes.INTEGER // in minutes
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isFree: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  timestamps: true
});

export default Lesson;
