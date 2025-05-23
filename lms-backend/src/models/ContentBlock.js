import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ContentBlock = sequelize.define('ContentBlock', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  type: {
    type: DataTypes.ENUM(
      'text', 
      'video', 
      'image', 
      'quiz',
      'file',
      'code',
      'embed'
    ),
    allowNull: false
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

export default ContentBlock;
