import { createContext, useState, useContext } from 'react';

// Crée un contexte pour l'authentification
const AuthContext = createContext();

// Composant fournisseur de contexte d'authentification
export const AuthProvider = ({ children }) => {
    // Déclare un état pour suivre si l'utilisateur est authentifié
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Fonction pour connecter l'utilisateur
    const login = () => {
        setIsAuthenticated(true);
    };

    // Fonction pour déconnecter l'utilisateur
    const logout = () => {
        setIsAuthenticated(false);
    };

    // Fournit les valeurs d'authentification et les fonctions aux composants enfants
    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personnalisé pour accéder au contexte d'authentification
export const useAuth = () => useContext(AuthContext);
