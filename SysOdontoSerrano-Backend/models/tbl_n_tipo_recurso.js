const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_tipo_recurso', {
    ID_TIPO_RECURSO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    NOMBRE_TIPO_RECURSO: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    TIPO_RECURSO_ACTIVO: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    DESCRIPCION_TIPO_RECURSO: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_tipo_recurso',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_TIPO_RECURSO" },
        ]
      },
    ]
  });
};
