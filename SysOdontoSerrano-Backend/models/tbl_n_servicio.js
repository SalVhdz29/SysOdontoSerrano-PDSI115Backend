const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_servicio', {
    ID_SERVICIO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NOMBRE_SERVICIO: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    DESCRIPCION_SERVICIO: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    COSTO_SERVICIO: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    PRECIO_SERVICIO: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    MINIMO_NUMERO_CITAS: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    MAXIMO_NUMERO_CITAS: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_servicio',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_SERVICIO" },
        ]
      },
    ]
  });
};
