// import axios from 'axios'

const API_URL = 'https://izaincol.com.co'

export default async (args) => {
    return new Promise((resolve, reject) => {
        try {
            fetch(`${API_URL}/apiv2/?method=${args.route}`, {
                method: 'POST',
                body: JSON.stringify(args.data)
            }).then((response) => response.json())
            .then((data) => {
                resolve(data) 
            })
        }
        catch(err) {
            reject(err)
        }
        // const axiosConfig = {
        //     method: args.method || 'GET',
        //     url: `${API_URL}/apiv2/?method=${args.route}`,
        //     data: args.data,
        //     headers: {
        //         ...args.headers,
        //         'Content-Type': args.contentType || 'application/json'
        //     }
        // }

        // axios(axiosConfig).then((response) => {
        //     resolve(response.data)
        // }).catch((err) => {
        //     reject(err)
        // })
    })
}