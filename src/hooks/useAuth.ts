import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuthStore } from "../store/useAuthStore";
import axiosClient from "../services/api/axiosClient";

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setLoading = useAuthStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const token = await firebaseUser.getIdToken();
          setToken(token);

          // Prepare user profile details based on Firebase Auth properties
          const localUser = {
            id: 0, // Fallback placeholder
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            role: (firebaseUser.email?.includes("admin") ? "admin" : "student") as "student" | "admin" | "reviewer",
            is_active: true,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          };

          try {
            // Synchronize token with the live PostgreSQL backend database
            const syncResponse = await axiosClient.post("/auth/sync");
            const backendUser = syncResponse.data;
            setUser({
              id: backendUser.id,
              uid: backendUser.firebase_uid,
              email: backendUser.email,
              role: backendUser.role,
              is_active: backendUser.status === "active",
              displayName: backendUser.full_name || localUser.displayName,
              photoURL: backendUser.photo_url || localUser.photoURL,
            });
          } catch (backendErr) {
            console.warn("FastAPI backend is offline or unsynced. Restoring session locally.", backendErr);
            setUser(localUser);
          }
        } else {
          setToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error("Error restoring Firebase session:", error);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setToken, setLoading]);
};
