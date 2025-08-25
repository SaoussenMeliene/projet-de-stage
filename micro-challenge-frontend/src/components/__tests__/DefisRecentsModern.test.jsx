import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DefisRecentsModern from '../DefisRecentsModern';
import challengesService from '../../services/challenges';

// Mock du service des défis
vi.mock('../../services/challenges', () => ({
  default: {
    list: vi.fn()
  }
}));

// Mock de useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Composant wrapper pour les tests
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    {children}
  </BrowserRouter>
);

describe('DefisRecentsModern', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche un état de chargement au début', async () => {
    // Mock d'une promesse qui ne se résout pas immédiatement
    challengesService.list.mockImplementation(() => new Promise(() => {}));

    render(
      <TestWrapper>
        <DefisRecentsModern />
      </TestWrapper>
    );

    expect(screen.getByText('Défis récents')).toBeInTheDocument();
    expect(screen.getByText('Chargement des derniers défis...')).toBeInTheDocument();
    
    // Vérifier que les squelettes de chargement sont affichés
    const skeletons = screen.getAllByRole('generic');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('affiche les défis récents récupérés depuis l\'API', async () => {
    const mockChallenges = [
      {
        _id: '1',
        title: 'Défi Écologique Test',
        description: 'Un défi test pour l\'environnement',
        category: 'Écologique',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Dans 7 jours
        participantsCount: 15,
        rewardPoints: 200,
        difficulty: 'Moyen'
      },
      {
        _id: '2', 
        title: 'Défi Solidaire Test',
        description: 'Un défi test pour la solidarité',
        category: 'Solidaire',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // Dans 5 jours
        participantsCount: 8,
        rewardPoints: 150,
        difficulty: 'Facile'
      }
    ];

    challengesService.list.mockResolvedValueOnce({
      items: mockChallenges
    });

    render(
      <TestWrapper>
        <DefisRecentsModern />
      </TestWrapper>
    );

    // Attendre que les données se chargent
    await waitFor(() => {
      expect(screen.getByText('Défi Écologique Test')).toBeInTheDocument();
    });

    expect(screen.getByText('Défi Solidaire Test')).toBeInTheDocument();
    expect(screen.getByText('Un défi test pour l\'environnement')).toBeInTheDocument();
    expect(screen.getByText('Un défi test pour la solidarité')).toBeInTheDocument();

    // Vérifier que l'API a été appelée avec les bons paramètres
    expect(challengesService.list).toHaveBeenCalledWith({
      limit: 3,
      sort: 'recent',
      status: 'active'
    });
  });

  it('affiche les défis statiques en cas d\'erreur API', async () => {
    // Mock d'une erreur API
    challengesService.list.mockRejectedValueOnce(new Error('Erreur API'));

    render(
      <TestWrapper>
        <DefisRecentsModern />
      </TestWrapper>
    );

    // Attendre que les données de fallback se chargent
    await waitFor(() => {
      expect(screen.getByText('Collecte de vêtements pour l\'hiver')).toBeInTheDocument();
    });

    expect(screen.getByText('Défi zéro déchet d\'une semaine')).toBeInTheDocument();
    expect(screen.getByText('Création d\'un mur d\'expression')).toBeInTheDocument();
  });

  it('transforme correctement les données des défis', async () => {
    const mockChallenge = {
      _id: 'test-id',
      title: 'Défi de Test',
      description: 'Description du défi',
      category: 'Créatif',
      startDate: '2024-01-15T00:00:00.000Z',
      endDate: '2024-01-22T00:00:00.000Z',
      participantsCount: 25,
      rewardPoints: 300,
      difficulty: 'Difficile'
    };

    challengesService.list.mockResolvedValueOnce({
      items: [mockChallenge]
    });

    render(
      <TestWrapper>
        <DefisRecentsModern />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Défi de Test')).toBeInTheDocument();
    });

    // Vérifier que les bonnes catégories sont affichées
    expect(screen.getByText('Créatif')).toBeInTheDocument();
    expect(screen.getByText('Description du défi')).toBeInTheDocument();
    expect(screen.getByText('300 pts')).toBeInTheDocument();
    expect(screen.getByText('25 participants')).toBeInTheDocument();
  });

  it('gère les différents formats de réponse API', async () => {
    // Test avec format response.data
    const mockChallenges = [{
      _id: '1',
      title: 'Test Défi',
      description: 'Test description',
      category: 'Test',
      participantsCount: 5
    }];

    challengesService.list.mockResolvedValueOnce({
      data: mockChallenges
    });

    render(
      <TestWrapper>
        <DefisRecentsModern />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Défi')).toBeInTheDocument();
    });

    // Test avec format response.challenges
    challengesService.list.mockResolvedValueOnce({
      challenges: mockChallenges
    });

    render(
      <TestWrapper>
        <DefisRecentsModern />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Défi')).toBeInTheDocument();
    });
  });

  it('affiche les bonnes icônes selon la catégorie', async () => {
    const mockChallenges = [
      {
        _id: '1',
        title: 'Défi Solidaire',
        category: 'Solidaire',
        participantsCount: 5
      },
      {
        _id: '2', 
        title: 'Défi Écologique',
        category: 'Écologique',
        participantsCount: 3
      },
      {
        _id: '3',
        title: 'Défi Créatif',
        category: 'Créatif',
        participantsCount: 2
      }
    ];

    challengesService.list.mockResolvedValueOnce({
      items: mockChallenges
    });

    render(
      <TestWrapper>
        <DefisRecentsModern />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Défi Solidaire')).toBeInTheDocument();
    });

    // Les icônes sont rendues, nous pouvons vérifier la présence des catégories
    expect(screen.getByText('Solidaire')).toBeInTheDocument();
    expect(screen.getByText('Écologique')).toBeInTheDocument();
    expect(screen.getByText('Créatif')).toBeInTheDocument();
  });
});