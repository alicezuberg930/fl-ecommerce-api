export interface MomoRequest {
    partnerCode?: string,
    partnerName?: string,
    storeId?: string,
    requestId?: string,
    amount?: number,
    orderId?: string,
    orderInfo?: string,
    redirectUrl?: string,
    ipnUrl?: string,
    lang?: string,
    requestType?: string,
    autoCapture?: boolean,
    extraData?: string,
    orderGroupId?: string,
    signature?: string,
    accessKey?: string,
    userInfo?: {
        name?: string,
        phoneNumber?: string,
        email?: string
    },
    items?: {
        id?: string,
        name?: string,
        imageUrl?: string,
        price?: number,
        currency?: string,
        quantity?: number,
        totalPrice?: number,
    }[]
}

export interface MomoResponse {

}