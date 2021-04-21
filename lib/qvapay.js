
const DEFAULT_HOST = 'qvapay.com'
const DEFAULT_PORT = '443'
const DEFAULT_BASE_PATH = '/api/v1'
const axios = require('axios')

class Qvapay {

    constructor(config = {}, axiosConfig = { timeout: 30000 }) {
        this.APP_ID = config.app_id;
        this.APP_SECRET = config.app_secret;
        this.axios = axios.create({
            baseURL: `https://${DEFAULT_HOST}:${DEFAULT_PORT}${DEFAULT_BASE_PATH}`,
            ...axiosConfig
        })
    }


    /**
     * 
     * Información sobre tu aplicación
     * 
     * Puede utilizar este endpoint para conocer los detalles generales de su aplicación de pagos 
     * en QvaPay, los límites asociados y las configuraciones generales en su panel de aplicaciones 
     * de QvaPay.
     * 
     * GET /api/{version}/info
     * 
     * @returns {Promise} Devuelve un objeto Request: Objeto JSON con los datos de la app
     *  {
     *       "user_id":1,
     *       "name":"my_website",
     *       "url":"https:\/\/www.website.com",
     *       "desc":"WebSite",
     *       "callback":"https:\/\/www.website.com\/webhook",
     *       "logo":"",
     *       "uuid":"123456789",
     *       "secret":"123456987",
     *       "active":1,
     *       "enabled":1
     *   }
     * 
     * */

    info() {
        return this.axios.get('/info', {
            params: {
                app_id: this.APP_ID,
                app_secret: this.APP_SECRET
            }
        })
    }

    /**
     * Crear factura de pago
     * 
     * Puede utilizar este endpoint para generar una dirección de pago QvaPay y solicitar a sus clientes que le paguen por un producto o servicio asociado a una aplicación de la plataforma. 
     * Con el objetivo de cobrar por servicios o productos en internet, el primer paso para generar dicha URL personalizada es crear una aplicación dentro de su panel de aplicaciones. 
     * Una vez que genera una URL de pago, es recomendable redirigir a su cliente hacia dicha página y esperar que este acepte o decline su intención de compra.
     * 
     * GET /api/{version}/create_invoice
     * 
     * @param {number} amount Cantidad de dinero a recibir (en dólares y con 2 decimales)
     * @param {string} description Descripción de la factura a generar, útil para brindar información al pagador. (No más de 300 caracteres)
     * @param {string} remote_id ID de factura en el sistema remoto (no requerido)
     * @param {boolean} signed Generación de una URL firmada o no (URL firmadas vencen a los 30 minutos, aportando más seguridad o caducidad)
     * 
     * @returns {Promise} Devuelve un objeto Request:: En el caso de la generación de una factura de compra, el objeto generado devuelve un objeto JSON con los mismos datos suministrados, adicionando una url de pago específica para esta solicitud de compra y una idéntica pero firmada digitalmente por 30 minutos y el UUID de la transacción generada.
     * {
     *    "app_id": "c2ffb4b5-0c73-44f8-b947-53eeddb0afc6",
     *    "amount": "25.60",
     *    "description": "Enanitos verdes",
     *    "remote_id": "BRID56568989",
     *    "signed": "1",
     *    "transation_uuid": "543105f4-b50a-4141-8ede-0ecbbaf5bc87",
     *    "url": "http://qvapay.test/pay/b9330412-2e3d-4fe8-a531-b2be5f68ff4c",
     *    "signedUrl": "http://qvapay.test/pay/b9330412-2e3d-4fe8-a531-b2be5f68ff4c?expires=1610255133&signature=c35db0f1f9e810fd51748aaf69f0981b8d5f83949b7082eeb28c56857b91072b"
     * }
     * 
     * */


    create_invoice(amount, description, remote_id, signed = 1) {
        amount = parseFloat(amount)
        if (!isNaN(amount) && amount > 0) {
            amount = amount.toFixed(2)
        } else {
            throw new Error('Amount is not a number or is less than 0')
        }
        if (description.length == 0 || description.length > 300 || typeof description !== 'string') {
            throw new Error('Description is not correct')
        }
        const params = {
            app_id: this.APP_ID,
            app_secret: this.APP_SECRET,
            amount,
            description,
            signed
        }

        if (remote_id) {
            params.remote_id = remote_id
        }

        return this.axios.get('/create_invoice', {
            params
        })
    }

    /**
     * Obtener Transacciones
     * Puede solicitar el listado completo de operaciones y/o transacciones realizadas por su aplicación de QvaPay.
     * Puede incluso paginar los resultados entregados. (Registro de 50 ítems por solicitud)
     * 
     * GET /api/{version}/transactions
     * 
     * @returns {Promise} Devuelve un objeto Request: La solicitud de transacciones será devuelta con un paginado de 50 transacciones ordenadas desde las más reciente hasta la más antigua.
     * {
     *   "current_page": 1,
     *   "data": [
     *       {
     *           "uuid": "b9330412-2e3d-4fe8-a531-b2be5f68ff4c",
     *           "user_id": 1,
     *           "app_id": 1,
     *           "amount": "25.60",
     *           "description": "Enanitos verdes",
     *           "remote_id": "BRID56568989",
     *           "status": "pending",
     *           "paid_by_user_id": 0,
     *           "created_at": "2021-01-10T04:35:33.000000Z",
     *           "updated_at": "2021-01-10T04:35:33.000000Z",
     *           "signed": 0
     *       }],
     *    "first_page_url": "http://qvapay.test/api/v1/transactions?page=1",
     *    "from": 1,
     *    "last_page": 1,
     *    "last_page_url": "http://qvapay.test/api/v1/transactions?page=1",
     *    "next_page_url": null,
     *    "path": "http://qvapay.test/api/v1/transactions",
     *    "per_page": 15,
     *    "prev_page_url": null,
     *    "to": 9,
     *    "total": 9
     *   }
     * 
     */

    transactions() {
        return this.axios.get('/transactions', {
            params: {
                app_id: this.APP_ID,
                app_secret: this.APP_SECRET
            }
        })
    }

    /**
     * Obtener Transacción según su UUID
     * Puede solicitar el estado e información relacionada de una transacción específica de su aplicación de QvaPay.
     * 
     * GET /api/{version}/transaction/{uuid}
     * 
     * @param {string} uuid Identificador de la transacción
     * 
     * @returns {Promise} Devuelve un objeto Request: La solicitud de dicha transacción será devuelta con los datos relacionados a dicha transacción como el owner de la aplicación y la aplicación en sí.
     * 
     * {
     *       "uuid": "6507ee0d-db6c-4aa9-b59a-75dc7f6eab52",
     *       "user_id": 1,
     *       "app_id": 1,
     *       "amount": "30.00",
     *       "description": "QVAPAY-APP",
     *       "remote_id": "15803",
     *       "status": "pending",
     *       "paid_by_user_id": 0,
     *       "signed": 0,
     *       "created_at": "2021-02-06T18:10:09.000000Z",
     *       "updated_at": "2021-02-06T18:10:09.000000Z",
     *       "paid_by": {
     *           "name": "QvaPay",
     *           "logo": "apps/qvapay.jpg"
     *       },
     *       "app": {
     *           "user_id": 1,
     *           "name": "QvaPay-app",
     *           "url": "https://qvapay.com",
     *           "desc": "Pasarela de pagos con criptomoendas",
     *           "callback": "https://qvapay.com/api/callback",
     *           "success_url": "",
     *           "cancel_url": "",
     *           "logo": "apps/L0YTTe3YdYz9XUh2B78OPdMPNVpt4aVci8FV5y3B.png",
     *           "uuid": "9955dd29-082f-470b-992d-f4f0f25ea164",
     *           "active": 1,
     *           "enabled": 1,
     *           "created_at": "2021-01-12T01:34:21.000000Z",
     *           "updated_at": "2021-01-12T01:34:21.000000Z"
     *       },
     *       "owner": {
     *           "uuid": "796a9e01-3d67-4a42-9dc2-02a5d069fa23",
     *           "username": "qvapay-owner",
     *           "name": "QvaPay",
     *           "lastname": "Pasarela Pagos",
     *           "logo": "profiles/zV93I93mbarZo0fKgwGcpWFWDn41UYfAgj7wNCbf.jpg"
     *       }
     *   }
     */

    transaction(uuid) {
        if (typeof uuid !== 'string') {
            throw new Error('UUID should be an string')
        }
        return this.axios.get(`/transaction/${uuid}`, {
            params: {
                app_id: this.APP_ID,
                app_secret: this.APP_SECRET
            }
        })
    }

    /**
     * Consultar saldo QvaPay
     * El balance de cuenta QvaPay te permitirá conocer el saldo actual para realizar operaciones de compras o transacciones.
     * 
     * GET /api/{version}/balance
     * 
     * @returns {Promise} Devuelve un objeto Request: Devuelve el balance de la cuenta
     * 
     * "66.00"
     * 
     */

    balance() {
        return this.axios.get('/balance', {
            params: {
                app_id: this.APP_ID,
                app_secret: this.APP_SECRET
            }
        })
    }



}

module.exports = Qvapay