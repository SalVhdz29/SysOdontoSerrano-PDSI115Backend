
INSERT INTO bd_odontoserrano_dsi.tbl_n_tipo_usuario(NOMBRE_TIPO_USUARIO) VALUES("Usuario normal");
INSERT INTO bd_odontoserrano_dsi.tbl_n_tipo_usuario(NOMBRE_TIPO_USUARIO) VALUES("Usuario rol");

INSERT INTO bd_odontoserrano_dsi.tbl_n_usuario(NOMBRE_USUARIO, CORREO_ELECTRONICO_USUARIO, ID_TIPO_USUARIO,CONTRASENIA_USUARIO, USUARIO_ACTIVO)
values("usuario_prueba", "prueba@correo.com", 1,"$2b$12$pasO0Rwm6yfqHSMnRaeSY.NA9mwCSH0xGfg7.zreYjMf3ogYouv.G", 1);