const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
 const tbl_n_usuario = sequelize.define('tbl_n_usuario', {
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
    ID_EMPLEADO: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tbl_n_empleado',
        key: 'ID_EMPLEADO'
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
      type: DataTypes.STRING(250),
      allowNull: true
    },
    FECHA_CREACION_USUARIO: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    FECHA_MODIFICACION_USUARIO: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    USUARIO_ACTIVO: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    DESCRIPCION_USUARIO: {
      type: DataTypes.STRING(250),
      allowNull: true
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
      {
        name: "FK_TIENE_UN",
        using: "BTREE",
        fields: [
          { name: "ID_EMPLEADO" },
        ]
      },
    ]
  });

  const generateHash = async(usuario) =>{
    // const salt = await bcrypt.genSalt(8); 
    // usuario.CONTRASENIA_USUARIO = await bcrypt.hash(usuario.CONTRASENIA_USUARIO, salt);
    // console.log("hook called");
    // console.log("la contrasenia a hashear: ", usuario.CONTRASENIA_USUARIO)
  
    //const salt = bcrypt.genSalt(10);
    usuario.CONTRASENIA_USUARIO = usuario.CONTRASENIA_USUARIO && usuario.CONTRASENIA_USUARIO != "" ? bcrypt.hashSync(usuario.CONTRASENIA_USUARIO, 12) : "";
  
  }
  
  tbl_n_usuario.addHook('beforeCreate',generateHash);
  //beforeCreate: generateHash
  // tbl_n_usuario.addHook('beforeUpdate',generateHash);
  tbl_n_usuario.beforeUpdate(
    async (usuario) => await generateHash(usuario)
  )
  
  
  tbl_n_usuario.prototype.validPassword=function(password) {
    let hash = bcrypt.hash(password, 12, function(err, hash){
      if(err){
        console.log('error', err)
      }
      else{
        // console.log("el hash: ", hash);
        return hash;
      }
    });
    // console.log( "el hash: ", hash);
    return bcrypt.compareSync(password, this.CONTRASENIA_USUARIO);
  }        
  
  return tbl_n_usuario;
};
