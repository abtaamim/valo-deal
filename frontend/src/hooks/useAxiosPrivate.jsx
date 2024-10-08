import { axiosPrivate } from "../api/axiosPrivate";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useAuth } from "../context/auth";
import { useNavigate, useLocation } from "react-router-dom";
const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate()
  const location = useLocation();
  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth.token}`
        }
        return config;
      }, (error) => Promise.reject(error)
    )

    const responseIntercept = axiosPrivate.interceptors.response.use(
      response => response,
      async (error) => {
        const prevRequest = error?.config;

        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
          return axiosPrivate(prevRequest);
        }
        if (error?.response?.status === 401) {
          setAuth({ ...auth, user:{}, token:'', loggedIn: false });
          navigate('/login', { state: { from: location }, replace: true });
        }
        return Promise.reject(error);
      }

    );
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    }
  }, [auth, refresh]); //
  return axiosPrivate;
}
export default useAxiosPrivate;
