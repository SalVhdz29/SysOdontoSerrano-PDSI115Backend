const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('permiso', {
    ID_RECURSO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tbl_n_recurso',
        key: 'ID_RECURSO'
      }
    },
    ID_USUARIO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tbl_n_usuario',
        key: 'ID_USUARIO'
      }
    },
    PERMISO_ACTIVO: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'permiso',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_RECURSO" },
          { name: "ID_USUARIO" },
        ]
      },
      {
        name: "FK_PERMISO2",
        using: "BTREE",
        fields: [
          { name: "ID_USUARIO" },
        ]
      },
    ]
  });
};
