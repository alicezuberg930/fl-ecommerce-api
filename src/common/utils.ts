const bcrypt = require("bcrypt")
import { BadRequestException } from '@nestjs/common'
import axios, { isAxiosError } from 'axios'
import crypto from 'crypto'
import qs from "qs"
import { dateFormat, HashAlgorithm, ProductCode, verifySecureHash, VNPay, VnpLocale } from 'vnpay'

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword)
}

let secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz'

export const momoPayment = async ({
    requestId, amount, orderId, orderInfo
}: {
    requestId: string, amount: number, orderId: string, orderInfo: string
}) => {
    //json object send to MoMo endpoint
    const requestBody = {
        partnerCode: "MOMO",
        partnerName: "Test",
        storeId: "Future Life",
        requestId,
        amount,
        orderId,
        orderInfo,
        ipnUrl: "http://localhost:4000/api/v1/transactions/callback",
        redirectUrl: `${process.env.ENVIRONMENT === "dev" ? process.env.FE_DEV_URL : process.env.FE_PRODUCTION_URL}/checkout/status`,
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
        // fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
        //     method: "POST", headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(requestBody)
        // }).catch(err => console.log(err))
        let a = await axios({ url: `https://test-payment.momo.vn/v2/gateway/api/create`, method: "POST", data: requestBody })
        console.log(a)
        return a.data
    } catch (error) {
        if (isAxiosError(error)) {
            throw new BadRequestException(error.response.data.message)
        } else {
            throw new BadRequestException("Interal server error")
        }
    }
}

export const momoVerifySignature = (query: any): boolean => {
    const { partnerCode, accessKey, orderId, amount, orderInfo, requestId, orderType, extraData, resultCode, message, responseTime, signature } = query
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}&partnerCode=${partnerCode}&responseTime=${responseTime}&resultCode=${resultCode}&requestId=${requestId}`
    const expectedSignature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex')
    return signature === expectedSignature
}

export const vnpayPayment = ({ orderId, orderInfo, total }: { orderId: string, orderInfo: string, total: number }) => {
    const vnpay = new VNPay({
        tmnCode: 'M1JA83YY',
        secureSecret: 'G5EKD2UT2YB0NUNQ33RJ08P70PCQC3RE',
        vnpayHost: 'https://sandbox.vnpayment.vn',
        queryDrAndRefundHost: 'https://sandbox.vnpayment.vn', // tùy chọn, trường hợp khi url của querydr và refund khác với url khởi tạo thanh toán (thường sẽ sử dụng cho production)
        testMode: true, // tùy chọn, ghi đè vnpayHost thành sandbox nếu là true
        hashAlgorithm: HashAlgorithm.SHA512, // tùy chọn
        /**
         * Bật/tắt ghi log
         * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
         */
        enableLog: true, // tùy chọn
        /**
         * Hàm `loggerFn` sẽ được gọi để ghi log khi enableLog là true
         * Mặc định, loggerFn sẽ ghi log ra console
         * Bạn có thể cung cấp một hàm khác nếu muốn ghi log vào nơi khác
         *
         * `ignoreLogger` là một hàm không làm gì cả
         */
        loggerFn: (data) => {
            console.log(data)
        },
        /**
         * Tùy chỉnh các đường dẫn API của VNPay
         * Thường không cần thay đổi trừ khi:
         * - VNPay cập nhật đường dẫn của họ
         * - Có sự khác biệt giữa môi trường sandbox và production
         */
        endpoints: {
            paymentEndpoint: 'paymentv2/vpcpay.html',
            queryDrRefundEndpoint: 'merchant_webapi/api/transaction',
            getBankListEndpoint: 'qrpayauth/api/merchant/get_bank_list',
        }, // tùy chọn
    });

    // const banks = await vnpay.getBankList()

    const paymentUrl = vnpay.buildPaymentUrl({
        vnp_Amount: total,
        vnp_IpAddr: '127.0.0.1',
        vnp_ReturnUrl: `${process.env.ENVIRONMENT === "dev" ? process.env.FE_DEV_URL : process.env.FE_PRODUCTION_URL}/checkout/status`,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: ProductCode.Pay,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
        vnp_ExpireDate: dateFormat(new Date(Date.now() + 3600000)), // tùy chọn
    });

    return paymentUrl

    // const tmnCode = "QB38NYN8";
    // const secretKey = "ZYUAA5YD6YMHAHPS0EZSVWNZ830H0PEM";
    // const vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    // const returnUrl = "http://localhost:3000/user/wallet";
    // let vnp_Params: any = {
    //     vnp_Version: '2.1.0',
    //     vnp_Command: 'pay',
    //     vnp_TmnCode: tmnCode,
    //     vnp_Locale: 'vn',
    //     vnp_CurrCode: 'VND',
    //     vnp_TxnRef: Date.now().toString(), // Unique transaction ID
    //     vnp_OrderInfo: 'thanh toan hoa don',
    //     vnp_OrderType: 'other',
    //     vnp_Amount: (12000 * 100), // Amount in VND
    //     vnp_ReturnUrl: returnUrl,
    //     vnp_IpAddr: '127.0.0.1', // Replace with your server's IP address
    //     vnp_CreateDate: new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14),
    // };

    // // Sort parameters alphabetically
    // vnp_Params = Object.keys(vnp_Params).sort().reduce((acc: any, key) => {
    //     acc[key] = vnp_Params[key];
    //     return acc;
    // }, {});

    // //Generate the query string
    // const signData = qs.stringify(vnp_Params, { encode: true });
    // console.log(signData);
    // // return
    // // Create HMAC SHA512 signature
    // const secureHash = crypto.createHmac('sha256', secretKey).update((signData)).digest('hex');

    // // Add the signature to the query string
    // const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: true })}&vnp_SecureHash=${secureHash}`;
    // // return paymentUrl;
    // console.log(paymentUrl);
    // return paymentUrl
}