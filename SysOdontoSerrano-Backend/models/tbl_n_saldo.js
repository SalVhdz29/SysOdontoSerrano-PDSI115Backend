const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_saldo', {
    ID_SALDO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_EXPEDIENTE: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_expediente',
        key: 'ID_EXPEDIENTE'
      }
    },
    SALDO: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    FECHA_CREACION: {
      type: DataTypes.DATE,
      allowNull: true
    },
    FECHA_MODIFICACION: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_saldo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_SALDO" },
        ]
      },
      {
        name: "FK_MANTIENE_UN",
        using: "BTREE",
        fields: [
          { name: "ID_F_EXPEDIENTE" },
        ]
      },
    ]
  });
};
