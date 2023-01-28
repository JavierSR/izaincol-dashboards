import axios from 'axios'

const API_URL = 'https://izaincol.com.co'

export default async (args) => {
    return new Promise((resolve, reject) => {
        const axiosConfig = {
            method: args.method || 'POST',
            url: `${API_URL}/apiv2/?method=${args.route}`,
            data: args.data,
            headers: {
                ...args.headers,
                'Content-Type': args.contentType || 'application/json'
            }
        }

        axios(axiosConfig).then((response) => {
            resolve(response.data)
        }).catch((err) => {
            reject(err)
        })
    })
}