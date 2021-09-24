const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_sesion', {
    ID_SESION: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_ESTADO_SESION: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_estado_sesion',
        key: 'ID_ESTADO_SESION'
      }
    },
    ID_EXPEDIENTE: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_expediente',
        key: 'ID_EXPEDIENTE'
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
    FECHA_SESION: {
      type: DataTypes.DATE,
      allowNull: true
    },
    FECHA_CREACION_SESION: {
      type: DataTypes.DATE,
      allowNull: true
    },
    HORA_ENTRADA: {
      type: DataTypes.DATE,
      allowNull: true
    },
    HORA_SALIDA: {
      type: DataTypes.DATE,
      allowNull: true
    },
    MOTIVO_REPROGRAMACION: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DETALLES_SESION: {
      type: DataTypes.STRING(550),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_sesion',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_SESION" },
        ]
      },
      {
        name: "FK_CONLLEVA_UN",
        using: "BTREE",
        fields: [
          { name: "ID_SERVICIO" },
        ]
      },
      {
        name: "FK_GENERA_CITAS",
        using: "BTREE",
        fields: [
          { name: "ID_EXPEDIENTE" },
        ]
      },
      {
        name: "FK_SE_CONTROLA_MEDIANTE",
        using: "BTREE",
        fields: [
          { name: "ID_F_ESTADO_SESION" },
        ]
      },
    ]
  });
};
