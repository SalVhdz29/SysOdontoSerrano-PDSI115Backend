const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_rol', {
    ID_ROL: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tbl_n_usuario',
        key: 'ID_USUARIO'
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
    ROL_USUARIO_ACTIVO: {
      type: DataTypes.TINYINT,
      allowNull: false
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
          { name: "ID_USUARIO" },
        ]
      },
      {
        name: "FK_TBL_N_ROL2",
        using: "BTREE",
        fields: [
          { name: "ID_USUARIO" },
        ]
      },
    ]
  });
};
