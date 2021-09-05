const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_tratamiento', {
    ID_TRATAMIENTO: {
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
    FECHA_CREACION_TRATAMIENTO: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_tratamiento',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_TRATAMIENTO" },
        ]
      },
      {
        name: "FK_SE_REGISTRAN_SUS_REVISIONES",
        using: "BTREE",
        fields: [
          { name: "ID_F_EXPEDIENTE" },
        ]
      },
    ]
  });
};
