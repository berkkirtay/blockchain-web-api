import axios from "axios"

const apiUrl = "http://localhost:8000/blockchain-api/v1";

// This class doesn't work for now.

export class HttpRequest {
    constructor() { }

    static get(url) {
        var response;
        axios.get(apiUrl + url)
            .then(response => {
                console.log(response.data);
                response = response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
        return response;
    }
}
