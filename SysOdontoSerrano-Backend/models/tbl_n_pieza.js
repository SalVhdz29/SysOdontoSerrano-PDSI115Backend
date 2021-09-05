const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_pieza', {
    ID_PIEZA: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_CUADRANTE: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_cuadrante',
        key: 'ID_CUADRANTE'
      }
    },
    NUMERO_PIEZA: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    NINIO_DIENTE: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_pieza',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_PIEZA" },
        ]
      },
      {
        name: "FK_PERTENECE_A",
        using: "BTREE",
        fields: [
          { name: "ID_F_CUADRANTE" },
        ]
      },
    ]
  });
};
