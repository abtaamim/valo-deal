import { customAxios } from "../api/axiosPrivate";
import { useAuth } from "../context/auth";

const useRefreshToken = () => {

  const [auth, setAuth] = useAuth();
  const refresh = async () => {
    const res = await customAxios.get('/api/v1/auth/refresh', {
      withCredentials: true
    }) //returns new access token
    setAuth(prev => {
      console.log('prev=>', prev.token)
      console.log('new=>', res.data.accessToken)
      return {
        ...prev,
        token: res.data.accessToken,
        user: res.data.user
        //role: res.data.role
      }
    });
    return res.data.accessToken;
  }

  return refresh;

}

export default useRefreshToken;