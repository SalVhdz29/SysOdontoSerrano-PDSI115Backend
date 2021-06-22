const express=require("express");
const api = express.Router();

//Controladores.
const ejemplo_Ctrl = require("../controllers/controlador_ejemplo");
const auth = require("../controllers/auth");
const recurso_controller = require("../controllers/recurso_controller");
//Middleware
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

