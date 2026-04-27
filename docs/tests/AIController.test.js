import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { loadGameFiles } from './utils/loadGameFiles.js';

// Load the AIController implementation before running tests
beforeAll(() => loadGameFiles(['AIController.js']));

//Creates a deterministic trajectory simulator for the AI aiming search.
function installDeterministicTrajectoryMock(endPosition = createVector(500, 300)) {
  globalThis.TrajectoryPreview = {
    simTimeStep: 0.016,
    maxSteps: 1,
    getLaunchState: vi.fn((shooter, angle, power) => ({
      launchPos: createVector(0, 0),
      launchVel: createVector(power, angle),
    })),
    simulationStep: vi.fn((mockShot) => {
      mockShot.position = endPosition.copy();
      return { collision: true };
    }),
  };
}

// Helper function to construct a controlled world state for AI testing
function createWorldState({ difficulty = 'easy' } = {}) {
  const targetPosition = createVector(500, 300);
  installDeterministicTrajectoryMock(targetPosition);

  return {
    shooter: {
      barrelAngle: -130,
      barrelPower: 420,
      currentWeapon: { id: 'cannon_ball' },
    },
    target: {
      position: targetPosition,
    },
    terrain: {
      getHeightAt: vi.fn(() => 650),
    },
    gravity: createVector(0, 400),
    wind: difficulty === 'easy' ? createVector(25, 0) : createVector(12, 0),
    rain: difficulty === 'easy' ? createVector(0, 18) : createVector(0, 9),
    executeShot: vi.fn(),
  };
}

describe('AIController - finite state machine and aiming behaviour', () => {
  beforeEach(() => {
    // Reset all mock call history before each test to ensure isolation
    vi.clearAllMocks();
  });

  it('waits in SHOP thinking state, then picks exactly one weapon and returns to idle', () => {
    const ai = new AIController('easy', 'SHOP');
    const shopContext = { pickWeapon: vi.fn() };

    // First update only consumes the thinking timer, so no weapon is picked yet.
    ai.startThinking();
    ai.updateAI(100, shopContext);

    expect(shopContext.pickWeapon).not.toHaveBeenCalled();

    // Once thinking has finished, the following state update performs the shop action.
    ai.updateAI(0, shopContext);
    ai.updateAI(0, shopContext);

    expect(shopContext.pickWeapon).toHaveBeenCalledTimes(1);
  });

  it('uses MATCH location to aim first and fire on the following update', () => {
    const ai = new AIController('easy', 'SHOP');
    const worldState = createWorldState({ difficulty: 'easy' });

    // The same AI object can transition from shop phase into match phase
    ai.location = 'MATCH';
    ai.startThinking();
    ai.updateAI(5000, worldState);
    ai.updateAI(0, worldState);

    // Aiming searches trajectories, but firing happens in a separate FSM step.
    expect(worldState.executeShot).not.toHaveBeenCalled();
    expect(globalThis.TrajectoryPreview.getLaunchState).toHaveBeenCalled();
    expect(globalThis.TrajectoryPreview.simulationStep).toHaveBeenCalled();

    ai.updateAI(0, worldState);

    expect(worldState.executeShot).toHaveBeenCalledTimes(1);
  });

  it('ignores wind and rain while aiming in easy mode', () => {
    const ai = new AIController('easy', 'MATCH');
    const worldState = createWorldState({ difficulty: 'easy' });

    ai.startThinking();
    ai.updateAI(5000, worldState);
    ai.updateAI(0, worldState);

    // Easy mode intentionally removes weather forces from AI aiming.
    expect(worldState.wind.x).toBe(0);
    expect(worldState.wind.y).toBe(0);
    expect(worldState.rain.x).toBe(0);
    expect(worldState.rain.y).toBe(0);
  });

  it('keeps weather forces active in hard mode and applies smaller aiming jitter', () => {
    const ai = new AIController('hard', 'MATCH');
    const worldState = createWorldState({ difficulty: 'hard' });

    ai.startThinking();
    ai.updateAI(5000, worldState);
    ai.updateAI(0, worldState);

    // Hard mode keeps random event forces in the shot simulation and adds only tiny jitter.
    expect(worldState.wind.x).toBe(12);
    expect(worldState.rain.y).toBe(9);
    expect(worldState.shooter.barrelAngle).toBeCloseTo(-94.5, 5);
    expect(worldState.shooter.barrelPower).toBeCloseTo(250, 5);
  });

  it('draws the thinking indicator only while the AI is thinking', () => {
    globalThis.push = vi.fn();
    globalThis.pop = vi.fn();
    globalThis.noStroke = vi.fn();
    globalThis.fill = vi.fn();
    globalThis.circle = vi.fn();

    const ai = new AIController('easy', 'MATCH');

    // Idle AI should not draw the three thinking dots.
    ai.drawThinkIndicator(createVector(100, 200));
    expect(globalThis.circle).not.toHaveBeenCalled();

    ai.startThinking();
    ai.drawThinkIndicator(createVector(100, 200));

    expect(globalThis.circle).toHaveBeenCalledTimes(3);
    expect(globalThis.circle).toHaveBeenCalledWith(80, 140, 3);
    expect(globalThis.circle).toHaveBeenCalledWith(100, 140, 3);
    expect(globalThis.circle).toHaveBeenCalledWith(120, 140, 3);
  });
});