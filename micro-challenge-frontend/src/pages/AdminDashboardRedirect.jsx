import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirection automatique vers le nouveau tableau de bord admin
    const checkAndRedirect = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch("http://localhost:5000/api/users/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user.role !== 'admin') {
            navigate('/accueil');
            return;
          }
          // Rediriger vers le nouveau tableau de bord admin
          navigate('/admin-dashboard', { replace: true });
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification:", error);
        navigate('/login');
      }
    };

    checkAndRedirect();
  }, [navigate]);

  // Cette page redirige automatiquement vers /admin-dashboard
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Shield className="mx-auto w-16 h-16 text-blue-600 mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Redirection en cours...</h2>
        <p className="text-gray-600">Vous allez être redirigé vers le nouveau tableau de bord administrateur.</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
