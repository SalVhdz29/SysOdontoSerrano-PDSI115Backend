const express=require("express");
const api = express.Router();

//Controladores.
const ejemplo_Ctrl = require("../controllers/controlador_ejemplo");
const auth = require("../controllers/auth");
const authMiddleware = require('../middlewares/authMiddleware')
const rol_controller = require("../controllers/rol_controller");

//endpoint
api.get("/hola", ejemplo_Ctrl.saludoMundo);
//endpoint con parametros en URL (por ser get).
api.get("/hola/:nombre", ejemplo_Ctrl.saludoPersonalizado);
// endpoint con dos parametros usados para una operación.
api.get("/hola/:parametro_1/:parametro_2", ejemplo_Ctrl.sumaParametros);
// busqueda de un usuario
api.post("/datos_usuario",authMiddleware._isAuth ,auth.usuario_registrado);
//inicio de sesión.
api.post("/login", auth.signIn); //cambiar a POST
// ruta de prueba de MiddleWare middleware de verificacion de seguridad.
api.post('/private', authMiddleware._isAuth,(req, res)=>{
    res.status(200).send("Autorizado");
})
//Lista de roles registrados ---- Gestion de Roles. 
api.post("/lista_roles_registrados",authMiddleware._isAuth, rol_controller.roles_registrados); 
//Cambio en estado de rol 
api.post("/cambiar_estado_rol",authMiddleware._isAuth, rol_controller.cambiar_estado_rol);
//lista de permisos activos. 
api.post("/lista_roles_permiso", authMiddleware._isAuth, rol_controller.rol_permisos);  
//creacion de roles 
api.post("/crear_rol", authMiddleware._isAuth, rol_controller.crear_rol); 
//actualizar rol
api.post("/actualizar_rol", authMiddleware._isAuth, rol_controller.actualizar_rol); 

module.exports= api;

