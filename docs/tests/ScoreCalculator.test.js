import { describe, it, expect, vi, beforeAll } from 'vitest';
import { loadGameFiles } from './utils/loadGameFiles.js';

beforeAll(() => loadGameFiles(['TurnController.js']));
const activePlayer = () => ({ stuckUntilTurn: 0, canAct: () => true });

// Factory function to simulate a player who is stuck and cannot act
const stuckPlayer = () => ({ stuckUntilTurn: 99, canAct: () => false });
describe('TurnController - turn-based combat flow', () => {

  // Test that turn order alternates correctly and rounds increment after both players act
  it('alternates player turns and advances the round after Player 2 finishes', () => {
    const turns = new TurnController();
    const players = [activePlayer(), activePlayer()];

    expect(turns.activePlayerId).toBe(0);
    expect(turns.turnNumber).toBe(1);

    turns.advancePhase(players);
    expect(turns.activePlayerId).toBe(1);
    expect(turns.turnNumber).toBe(1);

    turns.advancePhase(players);
    expect(turns.activePlayerId).toBe(0);
    expect(turns.turnNumber).toBe(2);
  });

  // Validate that stuck players are skipped and the skip callback is triggered correctly
  it('skips a stuck player and calls the skip callback', () => {
    const onSkip = vi.fn();
    const turns = new TurnController(undefined, onSkip);
    const players = [activePlayer(), stuckPlayer()];
    turns.advancePhase(players);

    // Bubblegum status effects use this path to skip the opponent's next turn.
    expect(onSkip).toHaveBeenCalledWith(1);
    expect(players[1].stuckUntilTurn).toBe(0);
    expect(turns.activePlayerId).toBe(0);
    expect(turns.turnNumber).toBe(2);
  });

  it('ends the match after the configured five rounds', () => {
    const turns = new TurnController();
    const players = [activePlayer(), activePlayer()];

    // Simulate multiple turns to exceed the round limit
    for (let i = 0; i < 10; i += 1) turns.advancePhase(players);
    expect(turns.turnNumber).toBe(6);
    expect(turns.isGameOver).toBe(true);
  });
});