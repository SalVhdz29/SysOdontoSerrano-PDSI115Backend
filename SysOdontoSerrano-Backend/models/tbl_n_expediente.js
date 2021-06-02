const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_expediente', {
    ID_EXPEDIENTE: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_PACIENTE: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_paciente',
        key: 'ID_PACIENTE'
      }
    },
    FECHA_CREACION_EXPEDIENTE: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_n_expediente',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_EXPEDIENTE" },
        ]
      },
      {
        name: "FK_REGISTRA_UN_EXPEDIENTE",
        using: "BTREE",
        fields: [
          { name: "ID_PACIENTE" },
        ]
      },
    ]
  });
};
