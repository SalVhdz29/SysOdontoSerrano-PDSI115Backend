const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_paciente', {
    ID_PACIENTE: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_PERSONA: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_persona',
        key: 'ID_PERSONA'
      }
    },
    SEXO: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    CORREO_ELECTRONICO_PACIENTE: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    PACIENTE_ACTIVO: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_n_paciente',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_PACIENTE" },
        ]
      },
      {
        name: "FK_PERTENECE_UNA",
        using: "BTREE",
        fields: [
          { name: "ID_PERSONA" },
        ]
      },
    ]
  });
};
