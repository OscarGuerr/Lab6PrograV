const HttpError = require('../models/http-error');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if(req.method === 'OPTIONS'){
        return next();
    }

    const token = req.headers.authorization.split(' ')[1]
    try {
        if(!token){
            throw new HttpError('Fallo de Authenticación')
        } 
        const decodedToken = jwt.verify(token, 'supersecreto_no_compartir_por_nada_de_nada');
        req.userData = {userId: decodedToken.userId};
        next();//pasamos al siguiente middleware.
        
    } catch (err) {
        console.log(err);
        const error = new HttpError('Fallo de authentication', 401);
        return next(error);

    }
}