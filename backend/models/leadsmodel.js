// const sequelize = require('../db/db.js');
// const { DataTypes } = require('sequelize');
// const {Contact} = require('./contactmodel.js')


// const Lead = sequelize.define('Lead', {
//   leadId: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//     contactId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: 'Contact',
//         key: 'id',
//       },
//     },
//     leadName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     userName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//   }, {
//     timestamps: true,
//     tableName: 'Leads'
//   });


//   Contact.associate = (models) => {
//     Contact.belongsTo(models.Lead, {
//       foreignKey: 'contactId',
//       as: 'lead',
//     });
//   };
  
//   // Lead.associate = (models) => {
//   //   Lead.hasOne(models.Contact, {
//   //     foreignKey: 'leadId',
//   //     as: 'contact',
//   //   });
//   // };
//   module.exports = {Lead};