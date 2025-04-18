export const parseTransactionStatus = (status: number) => {
    switch (status) {
        case 0:
            return "Transaction submitted!"
        case 1: 
            return "Transaction failed or rejected!"
        case 2:
            return "Submitting transaction..."
    }
}