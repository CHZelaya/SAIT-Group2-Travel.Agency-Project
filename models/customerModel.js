/**-----------------------------------------------------------------------------------------------------------------------
 * ?                                                     ABOUT
 * @author         :  Carlos Hernandez-Zelaya
 * @email          :  carlos.hernandezZelaya@edu.sait.ca
 * @project        :  Group 2 Threaded Project
 *-----------------------------------------------------------------------------------------------------------------------**/

/**------------------------------------------------------------------------
 **                            SEQUELIZE IMPORTS
 *------------------------------------------------------------------------**/

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database/database.js');



const Customers = sequelize.define(
    "Customers",
    {
        // Model attributes
        CustFirstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        CustLastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CustAddress: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CustCity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CustProv: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CustPostal: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CustCountry: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CustHomePhone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        CustBusPhone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        CustEmail: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false
    }
);


module.exports = Customers;
