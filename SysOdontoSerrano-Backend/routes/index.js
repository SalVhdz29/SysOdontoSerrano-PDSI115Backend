const express=require("express");
const api = express.Router();

//Controladores.
const ejemplo_Ctrl = require("../controllers/controlador_ejemplo");
const auth = require("../controllers/auth");
const tiporecurso_controller = require("../controllers/tiporecurso_controller");



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



////////   rutas para Controlador tiporecurso  /////////

//lista de tiporecurso registrados-Gestion de tiporecurso.
api.post("/lista_tiporecurso_registrados",authMiddleware._isAuth, tiporecurso_controller.tiporecurso_registrados);

//Cambio en estado de tiporecurso
api.post("/cambio_estado_tiporecurso",authMiddleware._isAuth, tiporecurso_controller.cambiar_estado_tiporecurso);

//lista de recursos activos.
//api.post("/lista_tiporecurso_recurso", authMiddleware._isAuth, tiporecurso_controller.tiporecurso_recurso);

//creacion de tiporecurso
api.post("/crear_tiporecurso", authMiddleware._isAuth, tiporecurso_controller.crear_tipo_recurso);

//actualizar recurso asociándolo con tiporecurso
api.post("/actualizar_recurso", authMiddleware._isAuth, tiporecurso_controller.actualizar_recurso);







module.exports= api;

