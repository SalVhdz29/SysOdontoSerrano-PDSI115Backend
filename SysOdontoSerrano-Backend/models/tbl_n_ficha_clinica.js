const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_ficha_clinica', {
    ID_FICHA_CLINICA: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_EXPEDIENTE: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_n_expediente',
        key: 'ID_EXPEDIENTE'
      }
    },
    FECHA_CREACION: {
      type: DataTypes.DATE,
      allowNull: true
    },
    EDAD_PACIENTE: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    DIENTE_COLOR: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    GUIA: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LIMPIEZA: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    ENDODONCIA: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DIENTE: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    VITALIDAD: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    MEDIDA_PROVISIONAL: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    RADIOGRAFIA: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    OTROS: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    FECHA_VENCIMIENTO_VALIDEZ: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_ficha_clinica',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_FICHA_CLINICA" },
        ]
      },
      {
        name: "FK_CONTIENE",
        using: "BTREE",
        fields: [
          { name: "ID_F_EXPEDIENTE" },
        ]
      },
    ]
  });
};
