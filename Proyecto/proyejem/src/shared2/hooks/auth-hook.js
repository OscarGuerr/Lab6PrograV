import { useEffect, useCallback, useState } from "react";

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(null);
    const [tokenExpirationDate, setTokenExpiration] = useState();

    const login = useCallback((uid, token, expirationDate) => {
        setToken(token);
        const tokenExpiration = expirationDate || new Date(new Date().getTime() + 1000*60*60)
        setTokenExpiration(tokenExpiration);
        localStorage.setItem(
            'userData',
            JSON.stringify({
                userId: uid, 
                token: token,
                expiration: tokenExpiration.toISOString()
            });
        );
        setUserId(uid);
    }, []);

    const logout = useCallback(() => {
        setToken(false);
        setTokenExpiration(null);
        localStorage.removeItem('userData');
        setUserId(null);
    }, []);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if(storedData && storedData.token && (new Date(storedData.expiration) > new Date())){
        login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
    }, [login])

    useEffect(() => {
        if(token && tokenExpirationDate){
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);
}