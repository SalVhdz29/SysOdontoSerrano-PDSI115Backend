const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_cotizacion_servicio', {
    ID_COTIZACION_SERVICIO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_COTIZACION: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_cotizacion',
        key: 'ID_COTIZACION'
      }
    },
    ID_F_SERVICIO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_servicio',
        key: 'ID_SERVICIO'
      }
    },
    CANTIDAD_REALIZACION_SERVICIO: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_cotizacion_servicio',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_COTIZACION_SERVICIO" },
        ]
      },
      {
        name: "FK_SE_REGISTRAN_EN_COTIZACIONES",
        using: "BTREE",
        fields: [
          { name: "ID_F_SERVICIO" },
        ]
      },
      {
        name: "FK_SE_REGISTRA_LOS_SERVICIOS_COTIZADOS",
        using: "BTREE",
        fields: [
          { name: "ID_F_COTIZACION" },
        ]
      },
    ]
  });
};
