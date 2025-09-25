const bcrypt = require("bcrypt")
import { BadRequestException } from '@nestjs/common'
import axios, { isAxiosError } from 'axios'
import crypto from 'crypto'

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword)
}
let secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'

export const momoPayment = async ({ requestId, amount, orderId }: { requestId: string, amount: number, orderId: string }) => {
    //json object send to MoMo endpoint
    const requestBody = {
        partnerCode: "MOMO",
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo: "pay with MoMo",
        ipnUrl: "http://localhost:4000/api/v1/transactions/callback",
        redirectUrl: "http://localhost:3000/user/wallet",
        lang: 'vi',
        requestType: "captureWallet",
        autoCapture: true,
        extraData: '',
        orderGroupId: '',
        accessKey: 'F8BBA842ECF85',
    }
    // sort json object in key ascending order
    const sortedRequestBody = Object.keys(requestBody).sort().reduce((acc: any, key: string) => {
        acc[key] = requestBody[key]
        return acc
    }, {})
    // before sign HMAC SHA256 with format
    let excludeKeys: string[] = ["orderGroupId", "autoCapture", "storeId", "partnerName", "lang"]
    let rawSignature = Object.entries(sortedRequestBody).filter(([key]) => !excludeKeys.includes(key)).map(([key, value]) => `${key}=${value}`).join('&')
    let signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')
    requestBody["signature"] = signature
    delete requestBody.accessKey
    try {
        let response = await axios({ url: `https://test-payment.momo.vn/v2/gateway/api/create`, method: "POST", timeout: 30000, data: requestBody })
        return response.data
    } catch (error) {
        if (isAxiosError(error)) throw new BadRequestException(error.response.data.message)
        else throw new BadRequestException("Server của momo bị lỗi")
    }
}

export const verifyMomoSignature = (query: any): boolean => {
    const { partnerCode, accessKey, orderId, amount, orderInfo, requestId, orderType, extraData, resultCode, message, responseTime, signature } = query
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&responseTime=${responseTime}&resultCode=${resultCode}&requestId=${requestId}`
    const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')
    return signature === expectedSignature
} 