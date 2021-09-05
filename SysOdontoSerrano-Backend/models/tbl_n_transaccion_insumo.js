const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_transaccion_insumo', {
    ID_TRANSACCION_INSUMO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_SESION: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_sesion',
        key: 'ID_SESION'
      }
    },
    ID_LOTE: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_lote',
        key: 'ID_LOTE'
      }
    },
    FECHA_TRANSACCION_INSUMO: {
      type: DataTypes.DATE,
      allowNull: true
    },
    CANTIDAD_INSUMO: {
      type: DataTypes.CHAR(10),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_transaccion_insumo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_TRANSACCION_INSUMO" },
        ]
      },
      {
        name: "FK_REGISTRA_DECREMENTOS_DE",
        using: "BTREE",
        fields: [
          { name: "ID_LOTE" },
        ]
      },
      {
        name: "FK_REGISTRA_EL_USO",
        using: "BTREE",
        fields: [
          { name: "ID_F_SESION" },
        ]
      },
    ]
  });
};
