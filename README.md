# qvapay
Biblioteca Nodejs para usar los servicios de la API de QvaPay. Para mayor información sobre el la API de QvaPay puede revisar: https://qvapay.com/docs/1.0/overview 

## Instalación

Usando npm:

```bash
$ npm install qvapay
```

Usando yarn:

```bash
$ yarn add qvapay
```


## Ejemplos

NOTA: Todos los métodos devuelven un Promise que finalmente retorna un objeto Request. Se puede acceder a los datos de la petición en el atributo **data**.

```js
const QvaPay = require('qvapay')

// Construir el objeto QvaPay pasando el secret y el id
const qvapay = new QvaPay({
    app_secret: "09Uedh83jb0sfc774nnshBShsydki83nBVs0yP99y",
    app_id: "78udFa-a678-aa67-9io0-fdg88h3cd6ja"
})

const bootstrap = async _ => {
    try {
        // Devuelve los detalles generales de 
        // su aplicación de pagos en QvaPay.
        const info = await qvapay.info()
        console.log(info.data)
        /**
         * Console output: 
         * {
         *   "user_id":1,
         *   "name":"my_website",
         *   "url":"https:\/\/www.website.com",
         *   "desc":"WebSite",
         *   "callback":"https:\/\/www.website.com\/webhook",
         *   "logo":"",
         *   "uuid":"123456789",
         *   "secret":"123456987",
         *   "active":1,
         *   "enabled":1
         * }
         * */

        
        //  Devuelve el saldo actual para realizar operaciones 
        //  de compras o transacciones.
        const balance = await qvapay.balance()
        console.log(balance.data)
        /**
         * 0.00
         * 
         * */

        // Puede utilizar este endpoint para generar una dirección de pago
        // QvaPay y solicitar a sus clientes que le paguen por un producto 
        // o servicio asociado a una aplicación de la plataforma.
        const invoice = await qvapay.create_invoice(0.01,"Invoice de Prueba", '000001')
        console.log(invoice.data)

         /**
          *  Console output: 
          * {
          *    "app_id":      "c2ffb4b5-0c73-44f8-b947-53eeddb0afc6",
          *    "amount": "25.60",
          *    "description": "Enanitos verdes",
          *    "remote_id": "BRID56568989",
          *    "signed": "1",
          *    "transation_uuid":"543105f4-b50a-4141-8ede-0ecbbaf5bc87",
          *    "url": "http://qvapay.test/pay/b9330412-2e3d-4fe8-a531-b2be5f68ff4c",
          *    "signedUrl": "http://qvapay.test/pay/  b9330412-2e3d-4fe8-a531-b2be5f68ff4c?expires=1610255133&  signature=c35db0f1f9e810fd51748aaf69f0981b8d5f83949b7082eeb28c56857b91072b"
          * }
          * 
          * */

         // Puede solicitar el estado e información relacionada de una 
         // transacción específica de su aplicación de QvaPay.
        const trans = await qvapay.transaction(invoice.data.transation_uuid)
        console.log(trans.data)
        /**
         * Console Output:
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
         * */


        // Puede solicitar el listado completo de operaciones y/o 
        // transacciones realizadas por su aplicación de QvaPay.
        const transactions = await qvapay.transactions()
        console.log(transactions.data)
        /**
         * Console Output:
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
         *    "first_page_url": "http://qvapay.test/api/v1/ transactions?page=1",
         *    "from": 1,
         *    "last_page": 1,
         *    "last_page_url": "http://qvapay.test/api/v1/  transactions?page=1",
         *    "next_page_url": null,
         *    "path": "http://qvapay.test/api/v1/transactions",
         *    "per_page": 15,
         *    "prev_page_url": null,
         *    "to": 9,
         *    "total": 9
         *   }
         * 
         */


    } catch (error) {
        console.error(error)
    }
}

bootstrap()
```
