const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_empleado', {
    ID_EMPLEADO: {
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
    FECHA_INGRESO: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    SALARIO: {
      type: DataTypes.DECIMAL(2,0),
      allowNull: false
    },
    FECHA_BAJA: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    EMPLEADO_ACTIVO: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_n_empleado',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_EMPLEADO" },
        ]
      },
      {
        name: "FK_SUS_DATOS_DE",
        using: "BTREE",
        fields: [
          { name: "ID_PERSONA" },
        ]
      },
    ]
  });
};
