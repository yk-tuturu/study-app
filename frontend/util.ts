import { AxiosError } from "axios";

export function ParseError(error: AxiosError): string {
    if (error.response) {
        return ((error.response.data as any).message || 'An unexpected error occurred!' )
    } else {
        return 'Unexpected error: ' + error.message;
    }
}