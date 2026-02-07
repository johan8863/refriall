import { authAPIEnvs } from "../settings/env";
import apiBase from "./baseService";

export const authAPI = {
    tokenPair: (credentials) => apiBase.post(authAPIEnvs.tokenPairUrl, credentials),
    tokenRefresh: (refresh) => apiBase.post(authAPIEnvs.refreshTokenUrl, refresh),
}