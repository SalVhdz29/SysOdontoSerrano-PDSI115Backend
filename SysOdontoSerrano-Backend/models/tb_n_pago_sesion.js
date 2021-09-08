const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tb_n_pago_sesion', {
    ID_PAGO_SESION: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_SESION: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_sesion',
        key: 'ID_SESION'
      }
    },
    ID_TIPO_PAGO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_tipo_pago',
        key: 'ID_TIPO_PAGO'
      }
    },
    CANTIDAD_PAGADA: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    PAGO_CON_DEUDA: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tb_n_pago_sesion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_PAGO_SESION" },
        ]
      },
      {
        name: "FK_SE_PAGA_COMO",
        using: "BTREE",
        fields: [
          { name: "ID_TIPO_PAGO" },
        ]
      },
      {
        name: "FK_SE_REGISTRA_UN_PAGO",
        using: "BTREE",
        fields: [
          { name: "ID_F_SESION" },
        ]
      },
    ]
  });
};
