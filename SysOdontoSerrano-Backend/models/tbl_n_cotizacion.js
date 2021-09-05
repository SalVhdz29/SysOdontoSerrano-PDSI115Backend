const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_cotizacion', {
    ID_COTIZACION: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_TRATAMIENTO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_tratamiento',
        key: 'ID_TRATAMIENTO'
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
        name: "FK_SE_HACE_UN",
        using: "BTREE",
        fields: [
          { name: "ID_F_TRATAMIENTO" },
        ]
      },
    ]
  });
};
