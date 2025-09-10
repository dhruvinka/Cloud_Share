import Transaction from "../pages/Transaction";

    const BASE_URL="http://localhost:8080";

    const apiEndpoints={
        FETCH_FILES: `${BASE_URL}/files/my`,
        TOGGLE_FILE: (id) => `${BASE_URL}/files/toggle/${id}`,
        UPLOAD_FILE: `${BASE_URL}/files/upload`,
        DELETE_FILE: (id) => `${BASE_URL}/files/${id}`,
        DOWNLOAD_FILE: (id) => `${BASE_URL}/files/download/${id}`,
        FETCH_PUBLIC_FILES: (id) => `${BASE_URL}/files/public/${id}`,
        GET_CREDITS: `${BASE_URL}/users/credits`,
        UPLOAD_FILES: `${BASE_URL}/files/upload`,
        CREATE_ORDER: `${BASE_URL}/payments/create-order`,
        VERIFY_PAYMENT: `${BASE_URL}/payments/verify`,
        TRANSACTION: `${BASE_URL}/transaction`,
        PublicFileView:(id) => `${BASE_URL}/files/public/${id}`,



    }

    export default apiEndpoints;