import { describe, it, expect, vi, beforeAll } from 'vitest';
import { loadGameFiles } from './utils/loadGameFiles.js';

beforeAll(() => loadGameFiles(['TurnController.js']));
const activePlayer = () => ({ stuckUntilTurn: 0, canAct: () => true });
const stuckPlayer = () => ({ stuckUntilTurn: 99, canAct: () => false });

describe('TurnController - turn-based combat flow', () => {
  // Verify that turns alternate correctly and rounds increment after Player 2 acts
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

  // Ensure that a player who cannot act is skipped and the callback is triggered
  it('skips a stuck player and calls the skip callback', () => {
    const onSkip = vi.fn();
    const turns = new TurnController(undefined, onSkip);
    const players = [activePlayer(), stuckPlayer()];

    turns.advancePhase(players);

    // Verify skip behavior and that the stuck state is cleared
    expect(onSkip).toHaveBeenCalledWith(1);
    expect(players[1].stuckUntilTurn).toBe(0);
    expect(turns.activePlayerId).toBe(0);
    expect(turns.turnNumber).toBe(2);
  });

  // Confirm that the match ends after reaching the maximum number of rounds
  it('ends the match after the configured five rounds', () => {
    const turns = new TurnController();
    const players = [activePlayer(), activePlayer()];
    for (let i = 0; i < 10; i += 1) turns.advancePhase(players);
    expect(turns.turnNumber).toBe(6);
    expect(turns.isGameOver).toBe(true);
  });
});