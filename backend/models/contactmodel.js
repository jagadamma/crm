const sequelize = require('../db/db.js');
const { DataTypes } = require('sequelize');

const Activity = sequelize.define('Activity', {
    activityType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    contactId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Contact',
            key: 'id'
        }
    }
}, {
    tableName: 'activities', // Explicitly set the table name
    timestamps: false // Disable timestamps on the Activity model if you don't need them
});

const Contact = sequelize.define('Contact', {
    // Basic Info
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
     // Name fields
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        len: [1, 255]
        }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        len: [1, 255]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        },
        set(value) {
    this.setDataValue('email', value.trim());
  }

    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companyWebsite: {
        type: DataTypes.STRING,
        allowNull: true
    },
    companySize: {
    type: DataTypes.STRING,
    allowNull: true
},

 phoneNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
        notEmpty: {
            msg: 'Phone number cannot be empty'
        },
        is: {
            args: /^[0-9]+$/i,
            msg: 'Phone number must contain only digits'
        }
    }
}

,
    companyLocation: {
        type: DataTypes.ENUM('USA', 'CANADA', 'UAE', 'INDIA', 'EUROPE'),
        allowNull: true
      },
    role: {
        type: DataTypes.STRING,
        allowNull: true
    },
    industryType: {
        type: DataTypes.STRING,
        allowNull: true
    },
    founderName:{
        type: DataTypes.STRING,
        allowNull: true
    },
    status:{
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
    type: DataTypes.STRING,
    allowNull: true
    },

    createdBy: {
  type: DataTypes.INTEGER,  // user id number asel tar
  allowNull: false
    },


    // Social Media Links
    companyLinkedinUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    linkedinProfileUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },

    // Image
   image: {
  type: DataTypes.TEXT('long'), // equivalent to LONGTEXT
  allowNull: true,
},

}, {
    tableName: 'contacts', // Explicitly set the table name
    timestamps: true, // Sequelize automatically adds createdAt and updatedAt
    underscored: false // Set to true if your column names are snake_case
});


Contact.associate = (models) => {
    Contact.hasMany(models.Activity, {
        foreignKey: 'contactId',
        as: 'activities' // Use an alias to access activities
    });
};

Activity.associate = (models) => {
    Activity.belongsTo(models.Contact, {
        foreignKey: 'contactId',
        as: 'contact'
    });
};


// Unique check function
const checkUniqueEmailOrPhone = async (email, phoneNo, excludeId = null) => {
  const whereClause = {
    [sequelize.Sequelize.Op.or]: [{ email }, { phoneNo }]
  };

  if (excludeId) {
    whereClause.id = { [sequelize.Sequelize.Op.ne]: excludeId };
  }

  const existingContact = await Contact.findOne({
    where: whereClause
  });

  return existingContact;
};


module.exports = {Contact, Activity, checkUniqueEmailOrPhone}