// import { useState, useEffect } from "react";
// import { useAuth } from "./authProvider";

// export const useUserData = () => {
//     const { user, token, checkAuth } = useAuth();
//     const [userData, setUserData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
  
//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           setLoading(true);
//           const data = await checkAuth();
//           setUserData(data);
//         } catch (err) {
//           setError(err);
//         } finally {
//           setLoading(false);
//         }
//       };
      
//       fetchData();
//     }, [token, checkAuth]);
  
//     return { userData, loading, error, refresh: checkAuth };
//   };