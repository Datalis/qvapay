
const axios = require('axios')
const Qvapay = require('../lib/qvapay')
jest.mock('axios');


test('Create Qvapay Object', () => {
    const qvapay = new Qvapay({ app_id: 'XXXX', app_secret: 'YYYY' })
    expect(qvapay.APP_ID).toBe('XXXX')
    expect(qvapay.APP_SECRET).toBe('YYYY')
})


test('Get APP Info', () => {
    const qvapay = new Qvapay({ app_id: 'XXXX', app_secret: 'YYYY' })
    const info = {
        user_id: 1,
        name: "my_website",
        url: "https:\/\/www.website.com",
        desc: "WebSite",
        callback: "https:\/\/www.website.com\/webhook",
        logo: "",
        uuid: "XXXX",
        secret: "YYYY",
        active: 1,
        enabled: 1
    }
    resp = { data: info };
    axios.get.mockResolvedValue(resp);
    qvapay.axios = axios
    return qvapay.info().then(data => {
        expect(data).toEqual(resp)
    })
})



test('Get APP Info', () => {
    const qvapay = new Qvapay({ app_id: 'XXXX', app_secret: 'YYYY' })
    const info = "0.00"
    resp = { data: info };
    axios.get.mockResolvedValue(resp);
    qvapay.axios = axios
    return qvapay.balance().then(data => {
        expect(data).toEqual(resp)
    })
})

test('Get a list of transactions', () => {
    const qvapay = new Qvapay({ app_id: 'XXXX', app_secret: 'YYYY' })
    const transacciones = {
        "current_page": 1,
        "data": [
            {
                "uuid": "b9330412-2e3d-4fe8-a531-b2be5f68ff4c",
                "user_id": 1,
                "app_id": 1,
                "amount": "25.60",
                "description": "Enanitos verdes",
                "remote_id": "BRID56568989",
                "status": "pending",
                "paid_by_user_id": 0,
                "created_at": "2021-01-10T04:35:33.000000Z",
                "updated_at": "2021-01-10T04:35:33.000000Z",
                "signed": 0
            }],
        "first_page_url": "http://qvapay.test/api/v1/transactions?page=1",
        "from": 1,
        "last_page": 1,
        "last_page_url": "http://qvapay.test/api/v1/transactions?page=1",
        "next_page_url": null,
        "path": "http://qvapay.test/api/v1/transactions",
        "per_page": 15,
        "prev_page_url": null,
        "to": 9,
        "total": 9
    }

    resp = { data: transacciones };
    axios.get.mockResolvedValue(resp);
    qvapay.axios = axios
    return qvapay.transactions().then(data => {
        expect(data).toEqual(resp)
    })
})


test('Create an Invoice OK', () => {
    const qvapay = new Qvapay({ app_id: 'XXXX', app_secret: 'YYYY' })
    const info = {
        app_id: "c2ffb4b5-0c73-44f8-b947-53eeddb0afc6",
        amount: "25.60",
        description: "Enanitos verdes",
        remote_id: "BRID56568989",
        signed: "1",
        transation_uuid: "543105f4-b50a-4141-8ede-0ecbbaf5bc87",
        url: "http://qvapay.test/pay/b9330412-2e3d-4fe8-a531-b2be5f68ff4c",
        signedUrl: "http://qvapay.test/pay/b9330412-2e3d-4fe8-a531-b2be5f68ff4c?expires=1610255133&signature=c35db0f1f9e810fd51748aaf69f0981b8d5f83949b7082eeb28c56857b91072b"
    }
    resp = { data: info };
    axios.get.mockResolvedValue(resp);
    qvapay.axios = axios
    return Promise.all([
        qvapay.create_invoice(22.233, "Testing Method", "22211", true).then(data => {
            expect(data).toEqual(resp)
        }),

        qvapay.create_invoice("33", "Testing Method", "22211", true).then(data => {
            expect(data).toEqual(resp)
        })
    ])
})

test('Create an Invoice with bad ammounts', () => {
    const qvapay = new Qvapay({ app_id: 'XXXX', app_secret: 'YYYY' })
    return Promise.all([
        expect(() => qvapay.create_invoice('XX', "Testing Method", "22211", true)).toThrow('Amount is not a number or is less than 0'),
        expect(() => qvapay.create_invoice(false, "Testing Method", "22211", true)).toThrow('Amount is not a number or is less than 0')])
})

test('Create an Invoice with bad description', () => {
    const qvapay = new Qvapay({ app_id: 'XXXX', app_secret: 'YYYY' })
    return Promise.all([
        expect(() => qvapay.create_invoice('02.2', "", "22211", true)).toThrow('Description is not correct'),
        expect(() => qvapay.create_invoice('02.2', 22, "22211", true)).toThrow('Description is not correct')])
})




test('Get a transaction', () => {
    const qvapay = new Qvapay({ app_id: 'XXXX', app_secret: 'YYYY' })
    const transaction = {
        "uuid": "6507ee0d-db6c-4aa9-b59a-75dc7f6eab52",
        "user_id": 1,
        "app_id": 1,
        "amount": "30.00",
        "description": "QVAPAY-APP",
        "remote_id": "15803",
        "status": "pending",
        "paid_by_user_id": 0,
        "signed": 0,
        "created_at": "2021-02-06T18:10:09.000000Z",
        "updated_at": "2021-02-06T18:10:09.000000Z",
        "paid_by": {
            "name": "QvaPay",
            "logo": "apps/qvapay.jpg"
        },
        "app": {
            "user_id": 1,
            "name": "QvaPay-app",
            "url": "https://qvapay.com",
            "desc": "Pasarela de pagos con criptomoendas",
            "callback": "https://qvapay.com/api/callback",
            "success_url": "",
            "cancel_url": "",
            "logo": "apps/L0YTTe3YdYz9XUh2B78OPdMPNVpt4aVci8FV5y3B.png",
            "uuid": "9955dd29-082f-470b-992d-f4f0f25ea164",
            "active": 1,
            "enabled": 1,
            "created_at": "2021-01-12T01:34:21.000000Z",
            "updated_at": "2021-01-12T01:34:21.000000Z"
        },
        "owner": {
            "uuid": "796a9e01-3d67-4a42-9dc2-02a5d069fa23",
            "username": "qvapay-owner",
            "name": "QvaPay",
            "lastname": "Pasarela Pagos",
            "logo": "profiles/zV93I93mbarZo0fKgwGcpWFWDn41UYfAgj7wNCbf.jpg"
        }
    }
    resp = { data: transaction };
    axios.get.mockResolvedValue(resp);
    qvapay.axios = axios
    return qvapay.transaction("6507ee0d-db6c-4aa9-b59a-75dc7f6eab52").then(data => {
        expect(data).toEqual(resp)
    })
})

test('Try to get a transaction with an incorrect id', () => {
    const qvapay = new Qvapay({ app_id: 'XXXX', app_secret: 'YYYY' })
    expect(() => qvapay.transaction(23)).toThrow('UUID should be an string')
    expect(() => qvapay.transaction()).toThrow('UUID should be an string')

})


