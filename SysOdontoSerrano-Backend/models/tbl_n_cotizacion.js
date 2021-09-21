const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_cotizacion', {
    ID_COTIZACION: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_EXPEDIENTE: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_expediente',
        key: 'ID_EXPEDIENTE'
      }
    },
    TOTAL_ESTIMADO: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_cotizacion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_COTIZACION" },
        ]
      },
      {
        name: "FK_COTIZA_SERVICIOS",
        using: "BTREE",
        fields: [
          { name: "ID_EXPEDIENTE" },
        ]
      },
    ]
  });
};
