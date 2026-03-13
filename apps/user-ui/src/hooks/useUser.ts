import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';


//fetch user data from the api
const fetchUser = async () => {
    const response = await axiosInstance.get("/api/logged-in-user");
    return response.data.data;
}


const useUser = () => { 
    const { data: user, isLoading, isError, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: fetchUser,
        staleTime: 1000 * 60 * 5, //caching user data for 5 minutes
        retry: 1, //retry only once on failure
    })
    return { user, isLoading, isError, refetch };
}

//use useuser hook anywhere when logged in information data is needed

export default useUser