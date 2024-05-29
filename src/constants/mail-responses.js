const { mailResponseConfig } = require("../configs/mail.config")



class NewUserResponse {
    constructor(userInput){
        this.from = mailResponseConfig.from
        this.user = userInput.first_name
        this.subject = `Bienvenido a nuestra comunidad ${this.user}`
        this.html = `<div>
        <h1>Te damos la bienvenida a nuestra comunidad ${this.user}</h1>

        <p>Podras comprar los artículos que necesites en nuestra sección de productos.</p>

        <p>Para poder publicar tus propios productos debes hacerte usuario premium. Esto lo puedes hacer facilmente desde tu perfil</p>

        <h2>Esperamos que encuentres todo lo que necesites</h2>
        
    </div>`
    }
}

class GeneratePasswordCode {
    constructor(userInput, restoreLink){
        this.from = mailResponseConfig.from
        this.user = userInput.first_name
        this.subject = `Correo de verificación de usuario`
        this.html = `<div>
        <h1>Hemos verificado tu usuario ${this.user}</h1>

        <p>Entra al siguiente link para poder terminar de restaurar tu contraseña</p>
        <p>El siguiente solo dura una hora, asi que si lo generaste hace más de ese tiempo ya no estará disponible y deberas volver a generarlo.</p>

        <p>Para poder publicar tus propios productos debes hacerte usuario premium. Esto lo puedes hacer facilmente desde tu perfil</p>

        <a href="${restoreLink}" id="restoreLink">${restoreLink}</a>
                        
        <h2>No es necesario que respondas a este mail</h2>
        
        </div>`
    }
}

class ChangePasswordConfirmed {
    constructor(userInput){
        this.from = mailResponseConfig.from
        this.user = userInput.first_name
        this.subject = `Confirmación de cambio de contraseña`
        this.html = `<div>
        <h1>Se ha modificado tu contraseña ${this.user}</h1>

        <p>Ya puede usar tu nueva contraseña. Recuerda anotarla en un lugar seguro para no volver a olvidarla.</p>
                        
        <h2>No es necesario que respondas a este mail</h2>
        
        </div>`
    }
}

class DeletedUserResponse {
    constructor(userInput) {
        this.from = mailResponseConfig.from
        this.user = userInput.first_name
        this.subject = `Aviso de eliminación de cuenta`
        this.html = `<div>
        <h1>Lamentablemente hemos eliminado tu cuenta ${this.user}</h1>

        <p>Como registramos una larga inactividad en tu cuenta, tomamos la decisión de eliminarla.</p>
        <p>Puedes volver a crear un cuenta cuando lo desees.</p>
                        
        <h2>No es necesario que respondas a este mail</h2>
        
        </div>`
    }
}


const mailResponses = {
    NewUserResponse: NewUserResponse,
    GeneratePasswordCode: GeneratePasswordCode,
    ChangePasswordConfirmed: ChangePasswordConfirmed,
    DeletedUserResponse: DeletedUserResponse
}

module.exports = mailResponses


