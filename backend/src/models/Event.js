import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Event = sequelize.define('events', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'organizer_id',
    references: {
      model: 'users',
      key: 'id',
    },
  },
  posterUrl: {
    type: DataTypes.STRING,
    field: 'poster_url',
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  },
  rejectionReason: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    field: 'rejection_reason',
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    field: 'average_rating',
  },
}, {
  timestamps: true,
  underscored: true,
});

// Add _id alias for frontend compatibility (MongoDB → Postgres migration)
Event.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  values._id = values.id;
  return values;
};

export { Event };
export default Event;
