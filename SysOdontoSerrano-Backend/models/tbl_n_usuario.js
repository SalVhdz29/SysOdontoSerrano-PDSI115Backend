const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_n_usuario', {
    ID_USUARIO: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ID_TIPO_USUARIO: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_n_tipo_usuario',
        key: 'ID_TIPO_USUARIO'
      }
    },
    NOMBRE_USUARIO: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    CORREO_ELECTRONICO_USUARIO: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    CONTRASENIA_USUARIO: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    FECHA_CREACION: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    FECHA_MODIFICACION: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    USUARIO_ACTIVO: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_n_usuario',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_USUARIO" },
        ]
      },
      {
        name: "FK_SE_CLASIFICA_POR",
        using: "BTREE",
        fields: [
          { name: "ID_TIPO_USUARIO" },
        ]
      },
    ],
    instanceMethods:{
      generateHash(contrasenia) {
        return bcrypt.hash(contrasenia, bcrypt.genSaltSync(8));
        },
      validPassword(contrasenia) {
        return bcrypt.compare(contrasenia, this.CONTRASENIA_USUARIO);
        }
    }

  });
};
