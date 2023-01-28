const API_URL = 'https://izaincol.com.co'

export default async (args) => {
    return new Promise((resolve, reject) => {
        fetch(`${API_URL}/apiv2/?method=${args.route}`, {
            method: 'POST',
            body: JSON.stringify(args.data)
        }).then((response) => response.json())
        .then((data) => {
            resolve(data) 
        }).catch((err) => {
            console.log(err)
            reject(err)
        })
    })
}