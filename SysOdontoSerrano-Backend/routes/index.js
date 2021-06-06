const express=require("express");
const api = express.Router();

//Controladores.
const ejemplo_Ctrl = require("../controllers/controlador_ejemplo");
const auth = require("../controllers/auth");
const usuario_controller = require("../controllers/usuario_controller");
//middleware de rutas
const authMiddleware = require('../middlewares/authMiddleware');


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
//lista de usuarios registrados-Gestion de usuarios.
api.post("/lista_usuarios_registrados",authMiddleware._isAuth, usuario_controller.usuarios_registrados);

//Cambio en estado de usuario
api.post("/cambio_estado_usuario",authMiddleware._isAuth, usuario_controller.cambiar_estado_usuario);

//lista de roles activos.
api.post("/lista_usuarios_rol", authMiddleware._isAuth, usuario_controller.usuario_roles);

//lista de empleados activos sin usuarios.
api.post("/lista_empleados_activos", authMiddleware._isAuth, usuario_controller.lista_empleados_activos);

//creacion de usuarios
api.post("/crear_usuario", authMiddleware._isAuth, usuario_controller.crear_usuario);

//actualizar usuario
api.post("/actualizar_usuario", authMiddleware._isAuth, usuario_controller.actualizar_usuario);


module.exports= api;

