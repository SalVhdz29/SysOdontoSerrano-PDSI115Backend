const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_rol', {
    ID_ROL: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_USUARIO_ROL: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_n_usuario',
        key: 'ID_USUARIO'
      }
    },
    ID_USUARIO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_usuario',
        key: 'ID_USUARIO'
      }
    }
  }, {
    sequelize,
    tableName: 'tbl_n_rol',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_ROL" },
        ]
      },
      {
        name: "FK_ROL",
        using: "BTREE",
        fields: [
          { name: "ID_F_USUARIO_ROL" },
        ]
      },
      {
        name: "FK_USUARIO_RELACIONADO",
        using: "BTREE",
        fields: [
          { name: "ID_USUARIO" },
        ]
      },
    ]
  });
};
