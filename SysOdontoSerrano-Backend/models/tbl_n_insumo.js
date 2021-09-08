const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_insumo', {
    ID_INSUMO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NOMBRE_INSUMO: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    DESCRIPCION_INSUMO: {
      type: DataTypes.STRING(350),
      allowNull: true
    },
    INSUMO_ACTIVO: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_insumo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_INSUMO" },
        ]
      },
    ]
  });
};
