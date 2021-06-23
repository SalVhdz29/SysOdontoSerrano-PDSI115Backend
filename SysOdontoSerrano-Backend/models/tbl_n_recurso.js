const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_recurso', {
    ID_RECURSO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_TIPO_RECURSO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_n_tipo_recurso',
        key: 'ID_TIPO_RECURSO'
      }
    },
    NOMBRE_RECURSO: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    DESCRIPCION_RECURSO: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    FECHA_CREACION_RECURSO: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    FECHA_MODIFICACION_RECURSO: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    RECURSO_ACTIVO: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    RUTA_RECURSO: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_n_recurso',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_RECURSO" },
        ]
      },
      {
        name: "FK_ES_UN",
        using: "BTREE",
        fields: [
          { name: "ID_TIPO_RECURSO" },
        ]
      },
    ]
  });
};
