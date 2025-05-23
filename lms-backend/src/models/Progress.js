import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Progress = sequelize.define('Progress', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  status: {
    type: DataTypes.ENUM(
      'not_started',
      'in_progress',
      'completed'
    ),
    defaultValue: 'not_started'
  },
  completedAt: {
    type: DataTypes.DATE
  },
  data: {
    type: DataTypes.JSON
  }
}, {
  timestamps: true
});

export default Progress;
