1️. Diagram Source Code
@startuml
class GameStateManager {
  - currentLevel : number
  - players : Player [2]
  - activePlayerIndex : number
  - terrain : Terrain
  - turnController : TurnController
  - weaponShop : WeaponShop
  - activeEvents : Event [*]
  - controlPanel : ControlPanel
  - scoreBoard : ScoreBoard
  - scoreCalculator : ScoreCalculator
  - currentShot : Projectile
  - currentExplosion : Explosion
  - isGameOver : boolean
  - winner : Player [0..1]

  + startNewGame()
  + initializeLevel()
  + initializePlayers()
  + runGameLoop()
  + updateGameState()
  + render()
  + handleInput()
  + applyStartOfTurnEvents()
  + endTurn()
  + checkGameOver() : boolean
  + getActivePlayer() : Player
  + getInactivePlayer() : Player
  + switchActivePlayer()
  + determineWinner()
}

class TurnController {
  - turnNumber : number
  - maxTurns : number
  - activePlayerId : number
  - turnCounter : TurnCounter
  - currentPhase : string
  - shotsFiredThisTurn : number

  + activePlayerId : number
  + turnNumber : number
  + maxTurns : number

  + startTurn()
  + endTurn()
  + advancePhase()
  + canPlayerAct(flying : boolean, exploding : boolean) : boolean
  + incrementShotCount()
  + isGameOver() : boolean

  - updateActivePlayerId()
  - incrementTurnCounter()
}

class Player {
  - name : string
  - playerId : number
  - color : color
  - cannon : PlayerCannon
  - weaponInventory : WeaponInventory
  - selectedWeapon : Weapon [0..1]
  - scoreCounter : ScoreCounter

  + getCannon() : PlayerCannon
  + getSelectedWeapon() : Weapon
  + selectWeapon(weapon : Weapon)
  + addScore(points : number)
  + getScore() : number
  + hasWeaponsRemaining() : boolean
}

class ScoreCounter {
  - score : number
  - positionVector : p5.Vector

  + addScore(points : number)
  + getScore() : number
  + drawScore()
}

class PlayerCannon {
  - positionVector : Vector
  - wheelRadius : number
  - barrelSize : Vector
  - barrelAngle : number
  - barrelPower : number
  - fillColor : color
  - outlineColor : color
  - targetX : number
  - weaponInventory : WeaponInventory
  - selectedWeapon : Weapon [0..1]

  + positionVector : Vector
  + wheelRadius : number
  + barrelAngle : number
  + barrelPower : number
  + targetX : number

  + fireShot(radius : number) : Projectile
  + updateMove(follow : number)
  + drawPlayer()
  + getSelectedWeapon() : Weapon
  + selectWeapon(weapon : Weapon)
  + hasWeaponsRemaining() : boolean

  - drawWheel()
  - drawBarrel()
}

class Weapon {
  - name : string
  - damage : number
  - explosionRadius : number

  + activate()
}

class WeaponInventory {
  - weapons : Weapon [*]

  + getWeapons() : Weapon [*]
  + addWeapon(weapon : Weapon)
  + removeWeapon(weapon : Weapon)
  + getWeaponsByType(typeName : string) : Weapon [*]
  + hasWeapon(weapon : Weapon) : boolean
  + getTotalWeaponCount() : number
}

class WeaponShop {
  - availableWeapons : Weapon [*]

  + purchaseWeapon(player : PlayerCannon, weapon : Weapon)
  + listAvailableWeapons()
}

class ScoreBoard {
  - score1 : number
  - score2 : number

  + constructor()
  + setup()
  + draw()
  + drawScoreBoard()
  + keyPressed()
  + addPointToPlayer1(points : number)
  + addPointToPlayer2(points : number)
  + getHighestScorePlayerId()
  + reset()
}

class ScoreCalculator {
  + calculateExplosionScore(explosion, players, shooterId)
  - calculateHit(explosion, cannon)
}

class Projectile {
  - position : p5.Vector
  - velocity : p5.Vector
  - radius : number
  - owner : Player
  - weapon : Weapon

  - isActive : boolean
  - isExploding : boolean
  - impactPosition : p5.Vector
  - explosionStartTime : number
  - maxExplosionRadius : number
  - hasAppliedExplosion : boolean

  + update(deltaTime : number)
  + drawProjectile()
  + applyWind(windVector : p5.Vector)
  + checkCollisionWithTerrain(terrain : Terrain) : boolean
  + checkExplosionScore(enemyCannon : PlayerCannon) : number
  + onImpact(position : p5.Vector, game : GameStateManager)

  + position : p5.Vector
  + vel : p5.Vector
  + isActive : boolean
  + isExploding : boolean
  + hasAppliedExplosion : boolean

  - drawShot()
  - drawExplosion()
}

class Explosion {
  - x : number
  - y : number
  - radius : number
  - maxRadius : number
  - terrain : Terrain
  - finished : boolean

  + update()
  + draw()
}

class Terrain {
  - sizeVector : p5.Vector
  - baseColor : color
  - columns : TerrainColumn [*]

  + Terrain(sizeVec : p5.Vector, baseColor : color)

  + generateInitialTerrain(seed : number)
  + drawTerrain()
  + getHeightAt(x : number) : number
  + setHeightAt(x : number, height : number)
  + applyExplosion(center : p5.Vector, radius : number)
  + applyAcidDamage(area : Rect)
  + applyOvergrowth(area : Rect)
}

class TerrainColumn {
  - xIndex : number
  - height : number
  - materialType : string

  + TerrainColumn(xIndex : number, height : number, materialType : string)
  + getTopY() : number
  + setHeight(height : number)
}

class ControlPanel {
  - baseAltitude : number
  - backgroundColor : color
  - angleDial : AngleDialWidget
  - shootButton : ShootButton
  - powerAdjust : PowerAdjustWidget
  - movePad : MovePadWidget
  - profile : p5.Vector [*] {static}

  + ControlPanel(bgColor : color)
  + drawCtrlPanel()
  + getAltitudeAt(panelTopX : number) : number

  + baseAltitude : number
  + angleDial : AngleDialWidget
  + powerAdjust : PowerAdjustWidget
  + shootButton : ShootButton

  - drawBackground()
}

class AngleDialWidget {
  - positionVector : p5.Vector
  - radius : number
  - plateFillColor : color
  - plateOutlineColor : color
  - isFollowing : boolean
  - needleRotation : number
  - needleColor : color {static}

  + AngleDialWidget()
  + drawAngleDial()

  + isFollowing : boolean
  + isHovered : boolean
  + needleRotation : number

  - drawPlate()
  - drawNeedle()
  - isHovered()
  - updateAngle()
}

class PowerAdjustWidget {
  - positionVector : p5.Vector
  - p1 : Object
  - p2 : Object
  - p3 : Object
  - plateOutlineColor : color
  - plateFillColor : color
  - isFollowing : boolean
  - power : number
  - sliderX : number

  + PowerAdjustWidget()
  + drawPowerAdjust()

  + isFollowing : boolean
  + isHovered : boolean
  + power : number

  + yOnLineByX(x : number, pA : Object, pB : Object) : number

  - drawBoard()
  - drawPower()
  - isHovered()
  - drawPowerText()
}

class MovePadWidget {
  - positionVector : p5.Vector
  - plateOutlineColor : color
  - plateFillColor : color
  - isFollowing : boolean
  - step : number
  - gap : number
  - btnWidth : number
  - btnHeight : number

  + MovePadWidget(posV : p5.Vector, plateInColor : color, plateOutColor : color)

  + drawMovePad()
  + mousePressed() : string
  + isFollowing : boolean
  + isHovered() : boolean

  - drawBoard()
  - drawButtons(dir : number)
  - drawArrow(cx : number, cy : number, dir : number)
  - getRect(dir : number) : Object
  - isHovered(r : Object) : boolean
}

class ShootButton {
  - positionVector : p5.Vector
  - fillColor : color
  - outlineColor : color

  + ShootButton(posVec : p5.Vector, fillColor : color, outColor : color)
  + drawButton()
  + isHovered : boolean

  - drawText()
  - isHovered() : boolean
}

class TurnCounter {
  - currentTurn : number
  - maxTurns : number
  - positionVector : p5.Vector

  + incrementTurn()
  + getCurrentTurn() : number
  + drawTurnCounter()
}

abstract class Event {
  - name : string
  - durationTurns : number
  - turnsRemaining : number
  - isActive : boolean

  + activate(game : GameStateManager)
  + deactivate(game : GameStateManager)
  + applyStartOfTurn(game : GameStateManager)
  + applyEndOfTurn(game : GameStateManager)
}

class WindSystem {
  - windForce : number
  - dragCoefficient : number
  - particles : array

  + newTurn()
  + applyEffect(gameState)
  + applyTo(projectile, dt)
  + draw()
}

class RainSystem
class Earthquake

GameStateManager --> TurnController
GameStateManager --> Terrain
GameStateManager --> Player : players
GameStateManager --> Event : activeEvents
GameStateManager --> WeaponShop
GameStateManager --> ScoreBoard
GameStateManager --> ScoreCalculator
GameStateManager --> ControlPanel
GameStateManager --> Projectile : currentShot
GameStateManager --> Explosion : currentExplosion
GameStateManager --> Player : winner

TurnController --> TurnCounter

Player --> PlayerCannon
Player --> WeaponInventory
Player --> ScoreCounter
WeaponInventory --> Weapon

Projectile --> Player : owner
Projectile --> Weapon : weapon
Projectile --> Explosion
Explosion --> Terrain
Terrain --> TerrainColumn

ControlPanel --> AngleDialWidget
ControlPanel --> ShootButton
ControlPanel --> PowerAdjustWidget
ControlPanel --> MovePadWidget

Weapon --> Projectile


Event <|-- WindSystem
Event <|-- RainSystem
Event <|-- Earthquake

@enduml

2.Class Diagram Preview
![Class Diagram](Week4_assignment_classDiagram.svg)
