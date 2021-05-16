module.exports={
    port: process.env.PORT || 3001, // puerto de prod o 3000 de desarrollo.
    db: process.env.MYSQLURL || "URL DE DESARROLLO", // url de db de prod o la local de desarrollo.
    SECRET_TOKEN: 'miclavedeTokens',
}