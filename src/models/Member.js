const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Member = sequelize.define('Member', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    memberId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: false
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true
      }
    },
    beltRank: {
      type: DataTypes.ENUM('white', 'yellow', 'green', 'blue', 'red', 'black'),
      allowNull: false,
      defaultValue: 'white'
    },
    danLevel: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 10
      }
    },
    joinDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    lastPromotion: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    certifications: {
      type: DataTypes.JSON,
      allowNull: true
    },
    achievements: {
      type: DataTypes.JSON,
      allowNull: true
    },
    emergencyContact: {
      type: DataTypes.JSON,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    unitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Units',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ['memberId']
      },
      {
        fields: ['beltRank']
      },
      {
        fields: ['unitId']
      },
      {
        fields: ['isFeatured']
      }
    ]
  });

  // Define associations
  Member.associate = function(models) {
    Member.belongsTo(models.Unit, {
      foreignKey: 'unitId',
      as: 'unit'
    });
  };

  return Member;
}; 