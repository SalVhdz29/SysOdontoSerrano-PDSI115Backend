const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_lote', {
    ID_LOTE: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_INSUMO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_insumo',
        key: 'ID_INSUMO'
      }
    },
    CANTIDAD_LOTE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    CANTIDAD_ACTUAL: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    FECHA_VENCIMIENTO: {
      type: DataTypes.DATE,
      allowNull: true
    },
    COSTO_LOTE: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    PORCENTAJE_GANANCIA: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    PRECIO_EFECTIVO: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_lote',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_LOTE" },
        ]
      },
      {
        name: "FK_REGISTRA_EXISTENCIAS",
        using: "BTREE",
        fields: [
          { name: "ID_F_INSUMO" },
        ]
      },
    ]
  });
};
