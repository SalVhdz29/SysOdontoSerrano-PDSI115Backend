const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_pieza_paciente', {
    ID_PIEZA_PACIENTE: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_F_FICHA_CLINICA: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_ficha_clinica',
        key: 'ID_FICHA_CLINICA'
      }
    },
    ID_F_PIEZA: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_pieza',
        key: 'ID_PIEZA'
      }
    },
    ID_F_ESTADO_PIEZA: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_estado_pieza',
        key: 'ID_ESTADO_PIEZA'
      }
    },
    SD_ID_F_ESTADO_SECCION: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_estado_seccion',
        key: 'ID_ESTADO_SECCION'
      }
    },
    SI_ID_F_ESTADO_SECCION: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_estado_seccion',
        key: 'ID_ESTADO_SECCION'
      }
    },
    ID_ID_F_ESTADO_SECCION2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_estado_seccion',
        key: 'ID_ESTADO_SECCION'
      }
    },
    II_ID_F_ESTADO_SECCION3: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_estado_seccion',
        key: 'ID_ESTADO_SECCION'
      }
    },
    LC_ID_F_ESTADO_SECCION: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_estado_seccion',
        key: 'ID_ESTADO_SECCION'
      }
    }
  }, {
    sequelize,
    tableName: 'tbl_n_pieza_paciente',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_PIEZA_PACIENTE" },
        ]
      },
      {
        name: "FK_CONTIENE_PIEZAS_DENTALES",
        using: "BTREE",
        fields: [
          { name: "ID_F_FICHA_CLINICA" },
        ]
      },
      {
        name: "FK_ESTADO_DE_SECCION_1",
        using: "BTREE",
        fields: [
          { name: "SD_ID_F_ESTADO_SECCION" },
        ]
      },
      {
        name: "FK_ESTADO_SECCION_2",
        using: "BTREE",
        fields: [
          { name: "SI_ID_F_ESTADO_SECCION" },
        ]
      },
      {
        name: "FK_ESTADO_SECCION_3",
        using: "BTREE",
        fields: [
          { name: "ID_ID_F_ESTADO_SECCION2" },
        ]
      },
      {
        name: "FK_ESTADO_SECCION_4",
        using: "BTREE",
        fields: [
          { name: "II_ID_F_ESTADO_SECCION3" },
        ]
      },
      {
        name: "FK_ESTADO_SECCION_5",
        using: "BTREE",
        fields: [
          { name: "LC_ID_F_ESTADO_SECCION" },
        ]
      },
      {
        name: "FK_HEREDA",
        using: "BTREE",
        fields: [
          { name: "ID_F_PIEZA" },
        ]
      },
      {
        name: "FK_SE_REGISTRA_UN_ESTADO_TOTAL",
        using: "BTREE",
        fields: [
          { name: "ID_F_ESTADO_PIEZA" },
        ]
      },
    ]
  });
};
