const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_cuadrante', {
    ID_CUADRANTE: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NOMBRE_CUADRANTE: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    NUMERO_CUADRANTE: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_cuadrante',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_CUADRANTE" },
        ]
      },
    ]
  });
};
