
import { useQuery } from "@tanstack/react-query";
import axiosInstance from '../utils/axiosInstance';

//fetch seller data from the api
const fetchSeller = async () => {
  const response = await axiosInstance.get("/api/logged-in-seller");
  return response.data.data;
};

const useSeller = () => {
  const {
    data: seller,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["seller"],
    queryFn: fetchSeller,
    staleTime: 1000 * 60 * 5, //caching user data for 5 minutes
    retry: 1, //retry only once on failure
  });
  return { seller, isLoading, isError, refetch };
};

//use useuser hook anywhere when logged in information data is needed

export default useSeller;