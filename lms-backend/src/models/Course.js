import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  duration: {
    type: DataTypes.INTEGER // in minutes
  },
  difficulty: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    defaultValue: 'beginner'
  },
  prerequisites: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.STRING
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  visibility: {
    type: DataTypes.ENUM('public', 'private', 'draft'),
    defaultValue: 'draft'
  },
  capacity: {
    type: DataTypes.INTEGER
  },
  thumbnail: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  paranoid: true // soft delete
});

export default Course;
