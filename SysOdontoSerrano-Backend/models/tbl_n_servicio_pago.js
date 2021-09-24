const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_servicio_pago', {
    ID_SERVICIO_PAGO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_PAGO_SESION: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tb_n_pago_sesion',
        key: 'ID_PAGO_SESION'
      }
    },
    ID_SERVICIO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_servicio',
        key: 'ID_SERVICIO'
      }
    },
    DEDUCIBLE: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    SUBTOTAL: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_servicio_pago',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_SERVICIO_PAGO" },
        ]
      },
      {
        name: "FK_REGISTRA_LO_PAGADO",
        using: "BTREE",
        fields: [
          { name: "ID_PAGO_SESION" },
        ]
      },
      {
        name: "FK_REGISTRA_USOS",
        using: "BTREE",
        fields: [
          { name: "ID_SERVICIO" },
        ]
      },
    ]
  });
};
