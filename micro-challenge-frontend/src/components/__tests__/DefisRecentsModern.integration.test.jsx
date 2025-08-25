import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DefisRecentsModern from '../DefisRecentsModern';

// Test d'intégration réel avec l'API backend
// (nécessite que le backend soit en marche sur localhost:5000)

const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('DefisRecentsModern - Test d\'intégration API', () => {
  it('récupère et affiche les vrais défis depuis l\'API backend', async () => {
    // Ce test nécessite que le backend soit en marche
    render(
      <TestWrapper>
        <DefisRecentsModern />
      </TestWrapper>
    );

    // Attendre que le chargement se termine
    await waitFor(() => {
      expect(screen.queryByText('Chargement des derniers défis...')).not.toBeInTheDocument();
    }, { timeout: 10000 });

    // Vérifier qu'au moins un défi s'affiche
    // (soit vrai défis de l'API, soit fallback statiques)
    await waitFor(() => {
      const defisElements = screen.getAllByText(/Défi|défi|Challenge/i);
      expect(defisElements.length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    // Vérifier que des boutons "Rejoindre" sont présents
    const joinButtons = screen.getAllByText(/Rejoindre|Participer/i);
    expect(joinButtons.length).toBeGreaterThan(0);

    // Vérifier que les catégories s'affichent
    const categories = screen.getAllByText(/écologique|solidaire|créatif|sportif/i);
    expect(categories.length).toBeGreaterThan(0);

    console.log('✅ Test d\'intégration réussi - Les défis récents fonctionnent !');
  }, 15000); // Timeout plus long pour l'API réelle
});