const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_sesion', {
    ID_SESION: {
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
    ID_F_ESTADO_SESION: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_estado_sesion',
        key: 'ID_ESTADO_SESION'
      }
    },
    FECHA_SESION: {
      type: DataTypes.DATE,
      allowNull: true
    },
    FECHA_CREACION_SESION: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_sesion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_SESION" },
        ]
      },
      {
        name: "FK_CONDUCE_A",
        using: "BTREE",
        fields: [
          { name: "ID_F_COTIZACION" },
        ]
      },
      {
        name: "FK_SE_CONTROLA_MEDIANTE",
        using: "BTREE",
        fields: [
          { name: "ID_F_ESTADO_SESION" },
        ]
      },
    ]
  });
};
