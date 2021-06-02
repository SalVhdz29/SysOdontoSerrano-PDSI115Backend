const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_detalle_persona', {
    ID_DETALLE_PERSONA: {
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
    NUMERO_DE_CONTACTO: {
      type: DataTypes.STRING(9),
      allowNull: true
    },
    DUI: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    DIRECCION: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_n_detalle_persona',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_DETALLE_PERSONA" },
        ]
      },
      {
        name: "FK_DESCRIBE_DETALLES",
        using: "BTREE",
        fields: [
          { name: "ID_PERSONA" },
        ]
      },
    ]
  });
};
