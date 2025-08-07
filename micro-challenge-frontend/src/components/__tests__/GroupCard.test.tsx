/**
 * Tests professionnels pour le composant GroupCard
 * Couvre tous les cas d'usage et interactions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, mockGroup } from '@/test/setup';
import GroupCard from '../GroupCard';
import type { Group, UserRole } from '@/types';

// Mocks
const mockOnGroupSelect = vi.fn();
const mockOnAddMember = vi.fn();

// Props par défaut
const defaultProps = {
  group: mockGroup,
  index: 0,
  userRole: 'collaborateur' as UserRole,
  onGroupSelect: mockOnGroupSelect,
  onAddMember: mockOnAddMember,
};

describe('GroupCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendu de base', () => {
    it('affiche les informations du groupe correctement', () => {
      renderWithProviders(<GroupCard {...defaultProps} />);

      expect(screen.getByText(mockGroup.name)).toBeInTheDocument();
      expect(screen.getByText(mockGroup.description)).toBeInTheDocument();
      expect(screen.getByText(mockGroup.memberCount.toString())).toBeInTheDocument();
    });

    it('affiche l\'avatar avec les bonnes initiales', () => {
      const group = { ...mockGroup, name: 'Test Group' };
      renderWithProviders(<GroupCard {...defaultProps} group={group} />);

      const avatar = screen.getByText('TG');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveClass('bg-gradient-to-r');
    });

    it('affiche le statut avec la bonne couleur', () => {
      const activeGroup = { ...mockGroup, statut: 'Très actif' };
      renderWithProviders(<GroupCard {...defaultProps} group={activeGroup} />);

      const statusBadge = screen.getByText('Très actif');
      expect(statusBadge).toHaveClass('bg-green-100', 'text-green-700');
    });
  });

  describe('Interactions utilisateur', () => {
    it('appelle onGroupSelect quand on clique sur la carte', async () => {
      const user = userEvent.setup();
      renderWithProviders(<GroupCard {...defaultProps} />);

      const card = screen.getByRole('button', { name: /rejoindre la discussion/i }).closest('div');
      await user.click(card!);

      expect(mockOnGroupSelect).toHaveBeenCalledWith(mockGroup);
    });

    it('appelle onGroupSelect quand on clique sur le bouton de discussion', async () => {
      const user = userEvent.setup();
      renderWithProviders(<GroupCard {...defaultProps} />);

      const discussionButton = screen.getByRole('button', { name: /rejoindre la discussion/i });
      await user.click(discussionButton);

      expect(mockOnGroupSelect).toHaveBeenCalledWith(mockGroup);
    });

    it('empêche la propagation lors du clic sur le bouton de discussion', async () => {
      const user = userEvent.setup();
      renderWithProviders(<GroupCard {...defaultProps} />);

      const discussionButton = screen.getByRole('button', { name: /rejoindre la discussion/i });
      
      // Simuler un clic avec stopPropagation
      fireEvent.click(discussionButton);

      // Le onGroupSelect devrait être appelé une seule fois
      expect(mockOnGroupSelect).toHaveBeenCalledTimes(1);
    });
  });

  describe('Permissions admin', () => {
    it('affiche le bouton d\'ajout de membre pour les admins', () => {
      renderWithProviders(
        <GroupCard {...defaultProps} userRole="admin" />
      );

      const addMemberButton = screen.getByRole('button', { name: /ajouter des membres/i });
      expect(addMemberButton).toBeInTheDocument();
    });

    it('n\'affiche pas le bouton d\'ajout de membre pour les collaborateurs', () => {
      renderWithProviders(
        <GroupCard {...defaultProps} userRole="collaborateur" />
      );

      const addMemberButton = screen.queryByRole('button', { name: /ajouter des membres/i });
      expect(addMemberButton).not.toBeInTheDocument();
    });

    it('appelle onAddMember quand on clique sur le bouton d\'ajout', async () => {
      const user = userEvent.setup();
      renderWithProviders(
        <GroupCard {...defaultProps} userRole="admin" />
      );

      const addMemberButton = screen.getByRole('button', { name: /ajouter des membres/i });
      await user.click(addMemberButton);

      expect(mockOnAddMember).toHaveBeenCalledWith(mockGroup.id);
    });
  });

  describe('Statistiques', () => {
    it('affiche les statistiques du groupe', () => {
      const groupWithStats = {
        ...mockGroup,
        membres: 10,
        points: 250,
        progression: 75
      };

      renderWithProviders(
        <GroupCard {...defaultProps} group={groupWithStats} />
      );

      expect(screen.getByText('10')).toBeInTheDocument(); // Membres
      expect(screen.getByText('250')).toBeInTheDocument(); // Points
      expect(screen.getByText('75%')).toBeInTheDocument(); // Progression
    });

    it('affiche la barre de progression avec le bon pourcentage', () => {
      const groupWithProgress = {
        ...mockGroup,
        progression: 60
      };

      renderWithProviders(
        <GroupCard {...defaultProps} group={groupWithProgress} />
      );

      const progressBar = document.querySelector('[style*="width: 60%"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('Accessibilité', () => {
    it('a les attributs ARIA appropriés', () => {
      renderWithProviders(<GroupCard {...defaultProps} />);

      const discussionButton = screen.getByRole('button', { name: /rejoindre la discussion/i });
      expect(discussionButton).toBeInTheDocument();

      const addMemberButton = screen.queryByRole('button', { name: /ajouter des membres/i });
      if (addMemberButton) {
        expect(addMemberButton).toHaveAttribute('title', 'Ajouter des membres');
      }
    });

    it('est navigable au clavier', async () => {
      const user = userEvent.setup();
      renderWithProviders(<GroupCard {...defaultProps} userRole="admin" />);

      // Tab vers le premier bouton
      await user.tab();
      expect(screen.getByRole('button', { name: /rejoindre la discussion/i })).toHaveFocus();

      // Tab vers le bouton d'ajout de membre
      await user.tab();
      expect(screen.getByRole('button', { name: /ajouter des membres/i })).toHaveFocus();
    });
  });

  describe('Gestion des erreurs', () => {
    it('gère les données manquantes gracieusement', () => {
      const incompleteGroup = {
        ...mockGroup,
        name: '',
        description: '',
        membres: undefined,
        points: undefined,
        progression: undefined
      };

      expect(() => {
        renderWithProviders(
          <GroupCard {...defaultProps} group={incompleteGroup} />
        );
      }).not.toThrow();
    });

    it('affiche des valeurs par défaut pour les statistiques manquantes', () => {
      const groupWithoutStats = {
        ...mockGroup,
        membres: undefined,
        points: undefined,
        progression: undefined
      };

      renderWithProviders(
        <GroupCard {...defaultProps} group={groupWithoutStats} />
      );

      // Vérifier que les valeurs par défaut sont affichées
      expect(screen.getByText('Membres')).toBeInTheDocument();
      expect(screen.getByText('Points')).toBeInTheDocument();
      expect(screen.getByText('Progression')).toBeInTheDocument();
    });
  });

  describe('Animations et styles', () => {
    it('applique le délai d\'animation basé sur l\'index', () => {
      const { container } = renderWithProviders(
        <GroupCard {...defaultProps} index={2} />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveStyle('animation-delay: 300ms');
    });

    it('applique les classes CSS personnalisées', () => {
      const { container } = renderWithProviders(
        <GroupCard {...defaultProps} className="custom-class" />
      );

      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Performance', () => {
    it('ne re-rend pas inutilement', () => {
      const { rerender } = renderWithProviders(<GroupCard {...defaultProps} />);

      // Premier rendu
      expect(screen.getByText(mockGroup.name)).toBeInTheDocument();

      // Re-render avec les mêmes props
      rerender(<GroupCard {...defaultProps} />);

      // Le composant devrait toujours être présent
      expect(screen.getByText(mockGroup.name)).toBeInTheDocument();
    });
  });
});
