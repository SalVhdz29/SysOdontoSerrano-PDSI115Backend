const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_servicio_insumo', {
    ID_SERVICIO_INSUMO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_SERVICIO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_servicio',
        key: 'ID_SERVICIO'
      }
    },
    ID_F_INSUMO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_insumo',
        key: 'ID_INSUMO'
      }
    },
    CANTIDAD_UTILIZADA: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SERVICIO_INSUMO_ACTIVO: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_servicio_insumo',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_SERVICIO_INSUMO" },
        ]
      },
      {
        name: "FK_REGISTRA_AQUELLOS_UTILIZADOS_EN_SERVICIO",
        using: "BTREE",
        fields: [
          { name: "ID_F_INSUMO" },
        ]
      },
      {
        name: "FK_REGISTRA_LOS_MAS_COMUN_UTILIZADOS",
        using: "BTREE",
        fields: [
          { name: "ID_F_SERVICIO" },
        ]
      },
    ]
  });
};
