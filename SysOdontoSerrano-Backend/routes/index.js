const express=require("express");
const api = express.Router();

//Controladores.
const ejemplo_Ctrl = require("../controllers/controlador_ejemplo");
const auth = require("../controllers/auth");
const usuario_controller = require("../controllers/usuario_controller");
//middleware de rutas
const authMiddleware = require('../middlewares/authMiddleware');
const rol_controller = require("../controllers/rol_controller");
const tiporecurso_controller = require("../controllers/tiporecurso_controller");
const expediente = require("../controllers/expediente_controller");
const recurso_controller = require("../controllers/recurso_controller");

api.post("/expediente",expediente._NuevoExpediente);
api.post("/update_expediente",expediente._UpdateExpediente);
api.post("/obtener_expediente",expediente._ObtenerExpediente);
api.post("/obtener_un_expediente",expediente._ObtenerUnExpediente);
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



////////   rutas para Controlador tiporecurso  /////////

//lista de tiporecurso registrados-Gestion de tiporecurso.
api.post("/lista_tiporecurso_registrados", authMiddleware._isAuth, tiporecurso_controller.tiporecurso_registrados);

//lista de recursos activos.
api.post("/lista_recurso_activos", authMiddleware._isAuth, tiporecurso_controller.recurso_activos);

//Cambio en estado de tiporecurso
api.post("/cambio_estado_tiporecurso", authMiddleware._isAuth, tiporecurso_controller.cambiar_estado_tiporecurso);

//creacion de tiporecurso
api.post("/crear_tiporecurso", authMiddleware._isAuth, tiporecurso_controller.crear_tipo_recurso);

//actualizar recurso asociándolo con tiporecurso
api.post("/actualizar_tipo_recurso", authMiddleware._isAuth, tiporecurso_controller.actualizar_recurso);



//authMiddleware._isAuth,




//Lista de servicios

//Recursos registrados
api.post("/recursos_registrados", authMiddleware._isAuth, recurso_controller.recursos_registrados);

//Cambio en estado del recurso
api.post("/cambiar_estado_recurso",authMiddleware._isAuth, recurso_controller.cambiar_estado_recurso);

//creacion de recurso
api.post("/crear_recurso", authMiddleware._isAuth, recurso_controller.crear_recurso);

//actualizar recurso
api.post("/actualizar_recurso", authMiddleware._isAuth, recurso_controller.actualizar_recurso);

//Lista tipos recurso
api.get("/lista_tipos_recurso_g_recurso",authMiddleware._isAuth, recurso_controller.lista_tipos_recurso);
module.exports= api;


