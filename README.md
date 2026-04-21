# 2026-group-17
2026 COMSM0166 group 17

# COMSM0166 Project Template
A project template for the Software Engineering Discipline and Practice module (COMSM0166).

## Info

This is the template for your group project repo/report. We'll be setting up your repo and assigning you to it after the group forming activity. You can delete this info section, but please keep the rest of the repo structure intact.

You will be developing your game using [P5.js](https://p5js.org) a javascript library that provides you will all the tools you need to make your game. However, we won't be teaching you javascript, this is a chance for you and your team to learn a (friendly) new language and framework quickly, something you will almost certainly have to do with your summer project and in future. There is a lot of documentation online, you can start with:

- [P5.js tutorials](https://p5js.org/tutorials/) 
- [Coding Train P5.js](https://thecodingtrain.com/tracks/code-programming-with-p5-js) course - go here for enthusiastic video tutorials from Dan Shiffman (recommended!)

## HOT CANNONS

HOT CANNONS is a two-player, turn-based artillery game inspired by Pocket Tanks, featuring a wide variety of random events that make each match unpredictable and dynamic. These events include switches between Day Mode and Dark Mode that affect visibility, weather effects such as acid rain and strong winds that alter damage and projectile behavior, and teleportation events that suddenly relocate cannons to different positions on the map. In addition, players can purchase various types of shots in a shop screen, combining weapons adapted from Pocket Tanks with newly designed ones. This system encourages players to plan ahead and customize their loadouts according to their preferred playstyle. On each turn, players must carefully choose which shot to use based on terrain conditions, available resources, and their overall strategy. The combination of strategic decision-making and unpredictable events ensures that no two matches play out the same, encouraging players to return to the game repeatedly. Overall, HOT CANNONS delivers a strategic and highly replayable game experience by blending classic artillery mechanics with dynamic environments, player choice, and elements of randomness.

STRAPLINE. Add an exciting one sentence description of your game here.

IMAGE. Add an image of your game here, keep this updated with a snapshot of your latest development.

[![Static Badge](https://img.shields.io/badge/Live%20Demo-WIP-EDF734?style=plastic&logo=p5dotjs&logoColor=crimson&logoSize=auto&labelColor=lightslategrey)](https://uob-comsm0166.github.io/2026-group-17/)

VIDEO. Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)

https://github.com/user-attachments/assets/d481b491-efc3-44cc-9b79-187f7e841b5e

## Development Team

![Group 17 team photo](/images/group_newphoto.jpg)

- Nikolay Slavov, ji25441@bristol.ac.uk, Dozuu-Touryou
- Shiho Morimatsu, rz25939@bristol.ac.uk, shiho1008
- Yinuo Li, cs25733@bristol.ac.uk, Liyinuo123
- Yuxin Hu, fx25208@bristol.ac.uk, Cindy04869
- Hsin-Man Liu, cw25376@bristol.ac.uk, hsinmanliu
- Yuqi Guo, rr24582@bristol.ac.uk, Allison-coder


## Project Report

### Introduction

- 5% ~250 words 
- Describe your game, what is based on, what makes it novel? (what's the "twist"?) 

### Requirements 

## Requirements

### 2.1 Ideation Process

During the early stages of the ideation process, our team began with a brainstorming session, where each member used Google Docs to independently research and record several game concepts that they were interested in developing. These initial ideas covered a range of gameplay styles, including action-based, strategy-focused, and arcade-inspired games.

After discussing the feasibility and development complexity of each idea, we conducted a quick team vote and decided to take Pocket Tanks as our main gameplay reference. Its turn-based artillery combat, projectile physics, and destructible environment mechanics provided a strong and achievable foundation for our project, while also offering clear opportunities for further innovation.

We then went about creating paper prototypes of our initial concept (Figure 4) in order to flesh out the specific gameplay details. This proved especially helpful considering the complexity of the concept, as it enabled us to better define the gameplay loop, player interaction flow, and core mechanics at an early stage. Paper prototyping was also valuable in improving communication within the team, particularly in helping all members visualise the turn-based combat flow, aiming controls, and overall user experience before moving into implementation.


### 2.2 Early Stage Design

Having selected Pocket Tanks as our main reference, we then identified several key design decisions to differentiate our game from the original concept.

1. Destructible terrain allows the battlefield to change dynamically after each explosion, adding greater strategic depth.

2. AI controlled opponent mode planned to support future single-player gameplay and extend system usability.

3. Weapon shop and enhanced weapon system enables players to select a limited loadout before each match, increasing tactical planning and gameplay variety.

4. Easy and Hard modes introduced to support different player skill levels, with Easy Mode providing trajectory guidance and Hard Mode increasing challenge.

5. Random events in Hard Mode includes rain, wind, and earthquake effects to improve replayability and require players to adapt their shooting strategy.

These early design decisions helped us expand the original artillery concept into a more strategic and replayable game system.

### 2.3 Stakeholder Identification: The Onion Model

To support our requirements planning, we applied The Onion Model to identify the key stakeholders involved in or affected by the development of HOT CANNONS (Figure X). This helped us visualise not only the direct users of the system, but also the wider technical, academic, and deployment context surrounding the game.

At the core layer, the system itself is HOT CANNONS. The containing system includes the immediate users, namely players and testers, whose feedback directly influenced usability, balance, and overall gameplay experience.

The wider environment includes the development team, instructors and assessors, and the reference game Pocket Tanks. Following Alexander’s concept of surrogate roles, instructors acted as representative stakeholders by providing feedback on software engineering quality, usability, and academic expectations.

The external environment includes the deployment platform (GitHub Pages), the broader user community, and course requirements, which together reflect the wider context in which the system is developed, deployed, and evaluated.

This stakeholder analysis ensured that our requirements considered not only gameplay needs, but also technical feasibility, user feedback, and academic constraints.
![Onion Model](images/onion%20model.png)
**Figure X. Onion Model Stakeholder Analysis**


### 2.4 Epics and User Stories

Based on the stakeholders identified through the Onion Model (Figure X), we translated stakeholder needs into a set of Epics and User Stories to guide system development and prioritise core features.

The main epics identified for HOT CANNONS were:

- Core artillery gameplay and destructible terrain
- Weapon shop and loadout system
- Difficulty modes and accessibility
- Dynamic events and replayability
- AI controlled single player mode
- User interface and user experience

These epics were directly informed by the needs of players, testers, the wider user community, and course requirements identified in the stakeholder analysis.

From these epics, we derived User Stories using the standard format:

> As a [user], I want [feature], so that [value].

Examples of key user stories include:

- As a player, I want destructible terrain so that each shot changes the battlefield and requires strategic decision-making.
- As a player, I want to select weapons before the match so that I can plan my gameplay strategy in advance.
- As a new player, I want tutorial pop-ups so that I can understand how to aim and fire correctly.
- As a new player, I want an Easy Mode with trajectory guidance so that I can quickly learn the controls and gameplay mechanics.
- As an experienced player, I want Hard Mode random events so that each match feels more challenging and unpredictable.
- As a colourblind player, I want distinguishable UI colours so that game information remains clear.
- As a single player user, I want to play against an AI opponent so that I can enjoy the game without requiring a second player.

These user stories helped ensure that our system requirements remained closely aligned with stakeholder needs and supported both gameplay quality and accessibility.

### 2.5 Use Case Diagram

To ensure the entire team maintained a shared understanding of the system–user interactions and the overall gameplay flow, we developed a Use Case Diagram as part of our requirements engineering process.

The diagram was particularly useful in modelling the main gameplay flow of HOT CANNONS, including game setup, difficulty selection, weapon selection, turn-based shooting, terrain updates, and match progression.

This enabled the team to maintain a clear high-level view of the system behaviour and better understand the relationships between the core gameplay features and planned user interactions.
![Use Case Diagram](images/use-case-diagram.png)
*Figure X. Use case diagram for HOT CANNONS*

### 2.5 Use Case Specifications

<p><b>Easy Mode:</b><br>
Players are given a visible trajectory preview to support aiming and power adjustment.
</p>

<p><b>Hard Mode:</b><br>
Players do not receive trajectory guidance. During the five-round match, random environmental effects such as wind, rain, and earthquakes may occur and interfere with shooting. The AI opponent also performs with stronger and more accurate shots.
</p>

<table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
  <tr style="background-color:#2c3e50; color:white;">
    <th style="padding:10px; border:1px solid #ddd;">Use-Case Section</th>
    <th style="padding:10px; border:1px solid #ddd;">Easy Mode</th>
    <th style="padding:10px; border:1px solid #ddd;">Hard Mode</th>
  </tr>

  <tr style="background-color:#ecf0f1;">
    <td><b>Description</b></td>
    <td>A match flow in which players can learn and play the game with visual aiming support.</td>
    <td>A more challenging match flow in which aiming support is removed and environmental effects increase uncertainty.</td>
  </tr>

  <tr>
    <td><b>Basic Flow</b></td>
    <td>Start the game, select a game mode, choose Easy Mode, select weapons in the shop, and play turn by turn until a winner is determined.</td>
    <td>Start the game, select a game mode, choose Hard Mode, select weapons in the shop, and play turn by turn while dealing with random environmental interference until a winner is determined.</td>
  </tr>

  <tr style="background-color:#ecf0f1;">
    <td>1</td>
    <td>Player starts the game and may view the tutorial before entering the match.</td>
    <td>Player starts the game and may view the tutorial before entering the match.</td>
  </tr>

  <tr>
    <td>2</td>
    <td>Player selects the game mode and proceeds to the weapon shop to choose a loadout.</td>
    <td>Player selects the game mode and proceeds to the weapon shop to choose a loadout.</td>
  </tr>

  <tr style="background-color:#ecf0f1;">
    <td>3</td>
    <td>During a turn, the player may move the cannon, select a weapon, and adjust angle and power with the help of a trajectory preview.</td>
    <td>During a turn, the player may move the cannon, select a weapon, and adjust angle and power without trajectory preview.</td>
  </tr>

  <tr>
    <td>4</td>
    <td>Player fires a projectile, the shot is resolved, terrain is updated, and the turn ends.</td>
    <td>Player fires a projectile, but environmental effects may alter projectile behaviour before the turn ends.</td>
  </tr>

  <tr style="background-color:#ecf0f1;">
    <td>5</td>
    <td>The next player or AI takes a turn. This continues until the win condition is met.</td>
    <td>The next player or AI takes a turn with higher accuracy and difficulty.</td>
  </tr>

  <tr>
    <td><b>Alternative Flow</b></td>
    <td>A player may miss due to incorrect angle or power selection, but trajectory preview helps adjustment.</td>
    <td>A player may miss due to lack of guidance or environmental interference.</td>
  </tr>

  <tr style="background-color:#ecf0f1;">
    <td>1</td>
    <td>An explosion modifies the terrain and affects later shots.</td>
    <td>Terrain changes plus environmental effects increase difficulty.</td>
  </tr>

  <tr>
    <td>2</td>
    <td>AI takes turns using the same logic as the player.</td>
    <td>AI uses more accurate firing behaviour.</td>
  </tr>

  <tr style="background-color:#ecf0f1;">
    <td>3</td>
    <td>Game continues until a player’s health reaches zero.</td>
    <td>Game continues with ongoing random disruptions.</td>
  </tr>

  <tr>
    <td><b>End Condition</b></td>
    <td>Game ends and results are displayed.</td>
    <td>Game ends after a more difficult match and results are displayed.</td>
  </tr>
</table>

### 3. Design

### 3.1 Design Evolution
In the early stages, our primary goal was to establish a functional prototype centered on core mechanics. However, as the project's complexity grew, we encountered significant engineering bottlenecks. The centralized `main` file became excessively long, making it difficult to coordinate and manage. Since each team member was responsible for developing different parts but all had to modify the same core file, the development process was plagued by frequent and complex merge conflicts. This initial structure not only slowed down progress but also increased the risk of accidental logic regressions，where one person's changes would inadvertently overwrite or break another’s code. To facilitate safer parallel development and better scalability, we moved from a centralized model to a Decentralized State Pattern.

| Phase | Conceptual Architecture Diagram | Architectural Logic & Evolution |
| :--- | :--- | :--- |
| **Initial Design** | <img src="images/stage1.png" alt="Initial Design" height="280"> | **Centralized Design:** Initially, a central `GameStateManager` coordinated all aspects (terrain, turns, players, UI). This was effective for prototyping but led to a "ripple effect" where UI changes could inadvertently break the physics engine, making the codebase hard to maintain. |
| **&darr;** | **Refactoring Path** | To resolve these dependencies, we transitioned to a modular gameplay layer guided by the State Pattern. |
| **Final Design** | <img src="images/stage3.png" alt="Final Design" height="280"> | **Decentralized Design:** The final architecture isolates the application lifecycle into specific States (**Menu**, **Shop**, **Match**, **End**). This ensures that heavy simulation logic is only resident in memory when necessary, keeping each phase isolated and maintainable. |

---

### 3.2 Key Differences and Architectural Improvements
By comparing the initial and final designs, several critical improvements in software engineering quality were achieved:

* **State-Driven Lifecycle & Memory Optimization**: Unlike the initial design where all logic was resident simultaneously, the final system uses the `Game` class to delegate behavior to the current `State`. This ensures that heavy simulation logic (e.g., the terrain engine) is only instantiated during an active match and disposed of upon returning to the menu, significantly optimizing memory performance.
* **Modular Coordination in `Match` Class**: The core gameplay logic is now concentrated in the `Match` class, acting as a dedicated coordinator. Instead of a monolithic loop, it collaborates with specialized classes (`TurnController`, `ScoreBoard`, `ControlPanel`, `Terrain`). This modularity prevents logic "leakage" between domains, improving readability and allowing features to be extended independently.
* **Polymorphic Weaponry System**: We utilized **Polymorphism** to handle the weapon inventory. All weapons inherit from `AbstractWeapon`, providing extension points for projectile behavior and rendering. Concrete classes (e.g., `Grapeshot`, `Lazershot`, `Submarinshot`) override these methods. This means the combat engine requires no hardcoded logic for specific weapons; behavior is delegated to the classes themselves, allowing for easy addition of new weapons without modifying the core firing logic.
* **Encapsulation of Custom Behavior**: Overall, the refactor achieved a clear separation of concerns: state management handles progression between screens, the `Match` system coordinates the battle environment, and weapon subclasses encapsulate custom combat physics.

### 3.3 How our design following Object Oriented Design Principle
| **OOD Feature** | **Examples in our Project** |
|---|---|
| **Abstraction** | `State` provides the common lifecycle interface (`updateState()`, `drawState()`), while `AbstractWeapon` defines shared weapon behaviour such as `drawProjectile()`, `onImpact()`, and `drawExplosion()`. |
| **Inheritance** | `MenuState`, `ShopState`, `MatchState`, and `EndState` inherit from `State`; weapon classes such as `Grapeshot`, `Lazershot`, and `Submarinshot` inherit from `AbstractWeapon`. |
| **Polymorphism** |The combat system can call `beforeProjectileStep()`, `onImpact()`, or `drawExplosion()` on any weapon, and each weapon class can provide its own implementation.|
| **Composition** | `Match` is composed of `Terrain`, `TurnController`, `ScoreBoard`, `ControlPanel`, `TrajectoryPreview`, weather systems, and active gameplay objects such as `Projectile` and `Explosion`.|
| **Encapsulation** | Classes use private fields such as `#players`, `#currentShot`, `#position`, and `#weaponLoadout`, with access managed through methods like `fireCurrentWeapon()` and `advancePhase()`.|

### 3.4 Class Diagrams

"To illustrate the structural growth and refactoring of the system, we have documented the class diagrams across three key development stages. This progression reflects our iterative transition and demonstrates how our understanding of software architecture and effective teamwork evolved throughout the project.

| Stage | Diagram | Description & Key Refinements |
| :--- | :--- | :--- |
| Stage 1: Initial Prototype | <img src="images/stage1.svg" alt="Stage 1" height="250"> | **The "God Object" Phase [[1]](#ref1):** In Stage 1, the `GameStateManager` was a "God Object" that tried to do everything, managing players, generating terrain, and controlling the UI all at once. This made the code risky to change. |
| **Stage 2: Refactored Prototype** | <img src="images/stage2.svg" alt="Stage 2" height="250"> | **Decoupling Responsibilities:** We began breaking down the monolithic controller. Logic started shifting towards specialized classes to improve maintainability, though the game flow was still tightly coupled. |
| **Stage 3: Final Implementation** | <img src="images/stage3.svg" alt="Stage 3" height="250"> | **Modular & State-Driven:** As the game grew, we refined these relationships. For example, while UI widgets like `AngleDialWidget` and `PowerAdjustWidget` existed from the start, they were moved in Stage 3 to be part of a dedicated `ControlPanel` inside the `Match` class. |

> **Interactive View:** For more details, please open the [homework page](https://github.com/UoB-COMSM0166/2026-group-17/tree/main/homework).


```mermaid
classDiagram
direction TB

class Game
class Effects

class State
class MenuState
class ShopState
class MatchState
class EndState

class StartMenu
class WeaponShop
class AIController

class Match
class PlayerCannon
class Projectile
class Explosion
class PoisonCloud
class ShibaImpactEffect
class FloatingScore

class ControlPanel
class WeaponInventory
class AngleDialWidget
class ShootButton
class PowerAdjustWidget
class MovePadWidget
class TrajectoryPreview

class TurnController
class TurnCounter
class ScoreBoard
class ScoreCalculator

class Terrain
class TerrainColumn

class WindSystem
class RainSystem
class EarthquakeSystem

class AbstractWeapon
class CannonBall
class Bubblegumshot
class Earthworm
class Grapeshot
class ImpactGun
class Lazershot
class Pineappleshot
class Shibashot
class Starshot
class Submarinshot

Game --> Effects : owns
Game --> State : currentState
State <|-- MenuState
State <|-- ShopState
State <|-- MatchState
State <|-- EndState

MenuState --> StartMenu : uses
MenuState --> ShopState : switches to

ShopState --> WeaponShop : owns
ShopState --> AIController : owns
ShopState --> MatchState : switches to

MatchState --> Match : owns
MatchState --> EndState : switches to
MatchState --> Effects : uses shake

EndState --> Game : restart

WeaponShop --> AbstractWeapon : displays/selects
WeaponShop --> AIController : AI shop pick

Match --> PlayerCannon : manages 2
Match --> Terrain : owns
Match --> ControlPanel : owns
Match --> TurnController : owns
Match --> TurnCounter : owns
Match --> ScoreBoard : owns
Match --> ScoreCalculator : owns
Match --> TrajectoryPreview : owns
Match --> WindSystem : owns
Match --> RainSystem : owns
Match --> EarthquakeSystem : owns
Match --> AIController : uses
Match --> Projectile : currentShot / secondaryShots
Match --> Explosion : currentExplosions
Match --> PoisonCloud : spawns
Match --> ShibaImpactEffect : spawns
Match --> FloatingScore : spawns

ControlPanel --> AngleDialWidget : owns
ControlPanel --> ShootButton : owns
ControlPanel --> PowerAdjustWidget : owns
ControlPanel --> MovePadWidget : owns
ControlPanel --> WeaponInventory : owns

WeaponInventory --> AbstractWeapon : displays
TrajectoryPreview --> AbstractWeapon : reads weapon behavior
TrajectoryPreview --> Terrain : simulates against
TrajectoryPreview --> PlayerCannon : reads launch state

Terrain --> ControlPanel : queries altitude
Terrain *-- TerrainColumn : contains

TurnController --> PlayerCannon : checks canAct
ScoreCalculator --> PlayerCannon : scores hits
ScoreBoard --> PlayerCannon : displays scores

PlayerCannon --> Projectile : fires
PlayerCannon o-- AbstractWeapon : weaponLoadout
Projectile --> AbstractWeapon : weapon behavior
Explosion --> AbstractWeapon : custom drawExplosion

WindSystem --> Projectile : applyTo
RainSystem --> Projectile : applyTo
EarthquakeSystem --> Projectile : applyTo

AbstractWeapon <|-- CannonBall
AbstractWeapon <|-- Bubblegumshot
AbstractWeapon <|-- Earthworm
AbstractWeapon <|-- Grapeshot
AbstractWeapon <|-- ImpactGun
AbstractWeapon <|-- Lazershot
AbstractWeapon <|-- Pineappleshot
AbstractWeapon <|-- Shibashot
AbstractWeapon <|-- Starshot
AbstractWeapon <|-- Submarinshot

AbstractWeapon --> Match : onImpact()
AbstractWeapon --> Explosion : drawExplosion()
AbstractWeapon --> Projectile : beforeProjectileStep()
```
<p style="text-align:center;">
  <b>Figure x:</b> Class diagram
</p>

### 3.5 Behavior Diagrams

While the Class Diagrams define the static structure, the following behavioral diagrams illustrate how our system interact with actors in real-time.

#### Overwiew Behavior Diagram
The first diagram provides a high-level overview of the entire game lifecycle. It maps the journey from the initial **Menu selection** through the **Weapon Shop** and into the active **Match**. 

```mermaid
sequenceDiagram
    actor P as Player
    participant G as Game
    participant MS as MenuState
    participant SS as ShopState
    participant WS as WeaponShop
    participant AI as AIController
    participant MTS as MatchState
    participant M as Match
    participant CP as ControlPanel
    participant PC as PlayerCannon
    participant PR as Projectile
    participant AW as AbstractWeapon
    participant EX as Explosion
    participant T as Terrain
    participant TC as TurnController
    participant SB as ScoreBoard
    participant ES as EndState

    P->>G: Start game
    G->>MS: load MenuState
    P->>MS: select difficulty
    MS->>G: switch to ShopState

    G->>SS: load ShopState
    SS->>WS: create weapon shop
    SS->>AI: create AI controller

    loop Weapon selection
        P->>WS: hover / choose weapon
        WS-->>P: show weapon info
        AI->>WS: auto-pick weapon
    end

    P->>SS: click Start Battle
    SS->>G: switch to MatchState

    G->>MTS: load MatchState
    MTS->>M: create Match
    M->>T: generate terrain
    M->>PC: create players
    M->>CP: create control panel
    M->>TC: initialize turn logic
    M->>SB: initialize scoreboard

    loop Each turn
        P->>CP: adjust angle / power / weapon
        P->>M: fire
        M->>PC: fire current weapon
        PC->>PR: create projectile
        PR->>AW: use weapon behavior

        loop Projectile flight
            M->>PR: updatePhysics()
            PR->>AW: beforeProjectileStep()
            PR-->>M: position / collision result
        end

        alt Projectile hits terrain or player
            M->>AW: onImpact()
            AW->>EX: create explosion(s)
            EX->>T: applyExplosion()
            M->>SB: update score
        else Projectile out of bounds
            PR-->>M: OUT_OF_BOUNDS
        end

        M->>TC: advancePhase()
        TC-->>M: next active player
    end

    alt Match finished
        M->>MTS: matchResults
        MTS->>G: switch to EndState
        G->>ES: load EndState
        ES-->>P: show winner and final scores
    end

```
<p style="text-align:center;">
  <b>Figure x:</b> Overview Behavior diagram
</p>


#### Detailed Behavior Diagram
The second diagram is a detailed Behavior Diagram, that focuses on the "Heart" of our game: battle execution and match completion.
This diagram highlights the dynamic orchestration of objects during a single turn. It traces how a player's fire command triggers a chain reaction.

```mermaid
sequenceDiagram
    actor Player
    participant Match
    participant PlayerCannon
    participant Projectile
    participant Weapon as AbstractWeapon/Subclass
    participant Explosion
    participant Terrain
    participant TurnController
    participant ScoreBoard

    Player->>Match: fire weapon
    Match->>PlayerCannon: fireCurrentWeapon()
    PlayerCannon->>Projectile: new Projectile(...)
    PlayerCannon-->>Match: projectile

    loop update each frame
        Match->>Projectile: updatePhysics(...)
        Projectile->>Weapon: beforeProjectileStep(...)
        Projectile-->>Match: flight result
    end

    alt terrain impact / player hit
        Match->>Weapon: onImpact(match, impactEvent, shot)
        Weapon->>Explosion: create explosion spec(s)
        Match->>Explosion: spawnWeaponExplosion(...)
        loop explosion update
            Match->>Explosion: update(dt)
            Explosion->>Terrain: applyExplosion(...)
        end
        Match->>ScoreBoard: add score
    else out of bounds
        Projectile-->>Match: OUT_OF_BOUNDS
    end

    Match->>TurnController: advancePhase(players)

```
<p style="text-align:center;">
  <b>Figure x:</b> Detailed Behavior diagram
</p>

### Implementation

- 15% ~750 words

During the development process the team encountered a number of challenges of varying complexity. Two major techical hurdles among those are highlighted below.

#### Destructible terrain

Terrain implementation began with the use of two classes - Terrain and TerrainColumn. Inside the terrain class an array of TerrainColumn object references was stored, each of which had a field storing the x and y positions of the column's top. The Terrain class would then use p5.js's noise() function to generate a y-position within a constrained range above the top of the control panel UI element which is positioned directly below the terrain. After that, the initial drawTerrain() method would use a custom shape drawn with vertices between p5.js's beginShape() and endShape() function calls. As the control panel element's top was initially flat there were only two vertices at the bottom and then as many as the width of the screen for the top of the terrain. When a circular explosion (the first type of explosion implemented in the game) affected terrain it would use the Pythagorean theorem to calculate the amount that each column's y-position should sink down and then that amount was added to the center.y coordinate of the circle to derive a new y-position for the top of each respective terrain column. 

The issue with the above approach was that floating terrain and overhangs were not possible as there could only ever be 1 non-bottom vertex in any column, when the goal was to have terrain without any support below it drift down until it settles on solid ground below. This prompted a comprehensive rework of the TerrainColumn class and to a lesser extent of the Terrain class. A pixels array was added to the TerrainColumn class to hold the y-position of each terrain pixel in the current column and the logic for calculating what part of the terrain to remove was moved to a removeExplodedPixels() method inside TerrainColumn which would use the dist() p5.js function in a comparison with the explosion circle's range to find out any pixels outside of the range of explosion in the current column and keep only them in the pixels array with the help of the Array.prototype.filter() method.

After an explosion, if a column was not completely destroyed then it would end up with one or more disconnected sequences of pixels which we decided to call spans. With this in mind the approach to drawing in the Terrain class was changed from using a custom shape to using the p5.js line() function - 1 line() call per span. To store the spans a new spans array was created in the TerrainColumn class. With this, static overhangs became possible.

The next step was to implement the settling down animation for any chunks of terrain which have no immediate support below them immediately after an explosion. To facilitate that, a targetSpans array field and a startSettling() method were added so the final position after settling of each span at the end of the animation could be calculated and stored. An updateAnimation() method would then gradually increase the progress of the animation stored in a settleProgress number field from 0.0 to 1.0 by adding to it the value of the p5.js deltaTime global variable modulated by a constant scalar and update each span's top and bottom y-positions using the p5.js lerp() to interpolate between the spans and targetSpans positions. This was an oversight which required the addition of a startSpans array field, so the starting position in the lerp calls could be fixed and work correctly. After the settleProgress field's value would grow above 1 the columns were snapped into the correct position by assigning to the values of the spans array the same values as those from the targetSpans array. Finally, a rebuildPixelsFromSpans() method would be called to update the pixels array based on the settled spans' y-coordinates.

Thus, the initial terrain settling animation was complete. However, the way floating terrain chunks settled appeared uneven and it was decided that all columns should settle down with the same constant speed, so chunks would appear to maintain their shape while falling down and then the shape would gradually break down as each column reaches its respective solid ground below. Settling spans did not move with constant speed at the time because the lerp function calls were moving spans in different columns with different speed depending on the distance each span needed to travel to the bottom. For example, when settleProgress was 0.5 a span that was initially floating 100 pixels above its target position had moved 50 pixels, while a span which was initially 50 pixels above solid ground would have only moved down 25 pixels when settleProgress was 0.5.

To achive the final desired behaviour one last update to the TerrainColumn class was required which changed the way the spans' positions were updated from using lerp() calls to simply adding the same original result of the multiplication between deltaTime and a constant speed directly to each span's top and bottom y-positions.

With the above change the desired settling animation was achieved, however, one bug also appeared. It involved settled spans settling what appeared to be 1 pixel or so above their respective target position. This was fixed by replacing the two spans in the spans array which were supposed to be stacked on top of each other with a single span based on the first and last element of the pixels array immediately after the rebuildPixelsFromSpans() call had completed.

#### AI-controlled player

During most of the development period, the game was a 2-player hot seater as the team was busy implementing other core features and fixing immersion-breaking bugs. This changed in the last week of the spring break as the game felt stable enough to implement a computer-controlled player to replace player 2.

The initial idea was for the AI behaviour to be fairly simple, considering the late stage it was being introduced in. Therefore, the initial version of the AI would pick weapons at random from the weapon shop screen, fire whatever the currently selected weapon is in its inventory and be unable to use the limited (3 moves per game) movement feature.

In terms of its implementation in the code, the AI works as a finite-state machine:

```mermaid
stateDiagram-v2
    direction LR

    [*] --> IDLE
    IDLE --> THINKING : startThinking()
    
    THINKING --> SHOPPING : if #location is SHOP
    THINKING --> AIMING : if #location is MATCH
    
    SHOPPING --> IDLE : pickWeapon()
    AIMING --> FIRING : findBestShotParams()
    FIRING --> IDLE : executeShot()
```
An AIController object is first instantiated in the ShopState class with its #location field set to SHOP and it is passed to the WeaponShop class's update() method which calls the AIController's startThinking() method each time the current player in the shop is player 2 and also calls the same object's updateAI() method passig it a callback to the pickRandomWeapon() method, so the AIController can call it when the time is right.

After all weapons have been picked and the player either clicks or presses the correct button a reference to the same AIController object is passed from ShopState to MatchState and then from there to the Match class.

In the Match class, the AI's #location field is changed to MATCH and during turn transition, if the current player is player 2, then it's startThinking() method is called. The AIController's drawThinkIndicator() method is also called to draw animated dots above the player 2's cannon, while it is in its THINKING state.

When it comes to the AI's aiming logic it reuses some of the mock shot calculation logic used for determining where to draw the trajectory preview curve in easy mode but without actually drawing the curve. Instead, it uses a nested loop to check every combination of ever 2° within an assumed reasonable shooting range of -100° to -175° with every 1.25 units of power within the range of 0 to 100 (which are mapped to the range 250 to 650 internally). An early exist from the loop is allowed, if the AI discovers a combination which resulsts in a minimum distance to the enemy of less than 5 pixels.

After the AI finds its ideal combination of parameters they are passed through an applyDifficultyJitter() method which remaps their value randomly within a different range depending on the current difficulty - significantly larger on easy mode for a higher likelihood of misses - and then player 2's parameters are set to those values.

Unfortunately, the abovementioned nested loop caused the game to stutter for what appeared to be 0.5-1 second (possibly longer on slower computers), as can be seen in Figure X likely due to the amount of iterations required to complete the whole loop. The early exit helped but was insufficient in eliminating the issue and so a different way of achieving the same outcome had to be found.

<div align="center">
  <img src="images/Wind_particles_stutter.gif" alt="Game stutter" width="200" />
  <br>
  <em>Figure X: Visual stutter occurring during the AI aiming state transition.</em>
</div>



### Evaluation
#### Qualitative: Think Aloud

The following section presents the outcome of the first think aloud evaluation of our game.

At this stage the game represented a minimum viable product. The core gameplay loop allowing 2 players to take turns adjusting the angle and power with which they shoot, fire a single weapon, score hits and determine a winner as well as 1 event - wind - had all been implemented in their initial form.

**Users' observations:**

1. The most frequently requested improvement mentioned by three users was some sort of indicator for whose turn it is as at the time there was no such clue
2. Two players wanted to know how many turns each match lasts.
3. Another player concern was the inability to precisely estimate the trajectory of shots before actually firing them.
4. One user thought it was unintuitive for shots flying off the left and right side of the screen to disappear and for those that fly off the top side to disappear and then fall down, eventually. They suggested adding some sort of barriers/invisible walls that make the shots explode or bounce on collision as a clearer indication of the outcome of the shots.
5. A suggested addition was to allow the Space key to fire shots, as well as allowing the arrow keys to move the current player's cannon. 
6. A user complained about the situation in which cannons that are close to each other and both get hit by the same explosion. In this case, the shooting player both gains and loses points which the user found confusing.

**Analysis outcome:**

1. To keep the player updated on whose turn it currently is, it was decided to have colored text added below the round counter in addition to adding a colored halo-like indicator around the wheel of the current active player and a triangle symbol above the halo.
2. Extra text should be added to the round counter which should show the total number of rounds in the match, for example - Turn 3/5, rather than just Turn 3.
3. While it is part of the gameplay challenge for players to have to estimate the correct angle and power necessary to accurately hit the enemy player, an easy mode in which either the partial or full trajectory of a shot is shown before firing would be a good and useful addition, especially when taking into consideration the requirements of future evaluations.
4. The team disagreed about this critique constituting a real issue. The suggestion to add some sort of either visible or invisible walls at the left top and right edges of the screen which would cause shots to explode or bounce could be an interesting addition (especially the bouncing variation) but not one that the team would like to prioritise, currently.
5. Adding quality of life additions such as hotkeys for the shoot button and the move pad widget is a welcome and straightforward addition to implement.
6. This should be resolved by reducing the number of times cannons can move in a single match to somewhere in the range of 2 to 4 times. As each player cannon start at a random position close to the opposite sides of the screen, making this change would make it much less likely for such a situation to occur. If it does occur, the original behaviour as described above is logical and should be preserved.
<br/>
<br/>

#### Quantitative: NASA Task Load Index (NASA-TLX) and System Usability Survey (SUS)

The number of valid samples for both the NASA-TLX and SUS questionnaires was 10. This analysis aims to investigate whether there is a significant difference between the easy and hard levels in perceived workload and usability. The tables below present the total scores for the easy and the hard level in both NASA-TLX and SUS.

<p align="center"><strong>Table x.</strong> Score of NASA-TLX and SUS</p>

<div align="center">

|User ID|NASA-TLX Easy|NASA-TLX Hard|SUS Easy|SUS Hard|
|:-------|---------------:|---------------:|---------------:|---------------:|
|User1|51.0|52.0|62.5|67.5|
|User2|33.0|52.0|57.5|50.0|
|User3|24.0|50.0|82.5|57.5|
|User4|16.0|68.0|65.0|86.0|
|User5|5.0|33.0|95.0|80.0|
|User6|38.0|33.0|65.0|52.5|
|User7|8.0|12.0|85.0|75.0|
|User8|7.0|22.0|60.0|55.0|
|User9|18.0|47.0|67.5|77.5|
|User10|13.0|22.0|87.5|85.0|
|**Average**|**21.3**|**39.1**|**72.75**|**68.5**|

</div>

**NASA-TLX**

1. Descriptive statistics and visualisation

>The distributions of the six dimensions differed between the easy and hard levels. Overall, the easy level appeared to have lower scores, and the average scores showed the same pattern.

<p align="center">
  <img src="images/NASA-TLX Metric.png" alt="NASA TLX Metric" width="600">
</p>

<p align="center"><strong>Figure x.</strong> Boxplot of NASA-TLX.</p>

<p align="center">
  <img src="images/NASA-TLX Radar.png" alt="NASA TLX Radar" width="600">
</p>

<p align="center"><strong>Figure x.</strong>Radar chart of the average NASA-TLX scores across dimensions.</p>

2. Wilcoxon signed-rank test

>At the 95% confidence level, the Wilcoxon signed-rank test results suggested that level significantly affected Performance, Effort and the overall NASA-TLX score. However, the differences in Mental Demand, Physical Demand, Temporal Demand, and Frustration between the easy and hard levels were not statistically significant difference.

<p align="center">

$$\begin{cases}
  H_0 &: \text{There's no significant difference between the easy and hard levels.}\\
  H_1 &: \text{There's significant difference between the easy and hard levels.}\\
\end{cases}$$

</p>

<p align="center"><strong>Table x.</strong> Wilcoxon Signed-Rank Test Results for NASA-TLX Scores Between Easy and Hard Levels</p>

<div align="center">

|Metric|W|p-value|Interpretation|
|:------------------|------:|------:|:---------------------------|
|Mental Demand|1.500|0.0938|No statistically significant difference|
|Physical Demand|5.500|0.6875|No statistically significant difference|
|Temporal Demand|4.500|0.5625|No statistically significant difference|
|Performance|0.000|0.0078|Statistically significant difference|
|Effort|0.0000|0.0078|Stat istically significant difference|
|Frustration|1.000|0.0625|No statistically significant difference|
|Total|3.000|0.0098|Statistically significant difference|

</div>

**SUS**

---

### Process 
### Role allocation across the entire project

At the initial stage of the project, we identified and mapped each member’s strengths and experiences in order to design an effective role allocation.

Specifically, members with creative strengths were responsible for visual design and video production, those with project management experience handled scheduling and task coordination, and members with a technical focus worked on gameplay implementation and AI development. Each member contributed to the foundation of the project by leveraging our strengths and experience.

<h3 align="center">Team Members’ Strengths and Role Mapping</h3>

| Role | Strengths / Experience | Main Responsibilities | Members |
|----------|----------------------|----------------------|----------|
| Developer | Programming / system development experience | Core gameplay implementation, Feasibility study | Hsinman, Nikolay, Yuqi |
| UI Designer | Game design interest | Weapon functionality, UI design | Yinuo |
| CO-Developer & Desiner | Programming / design skills | Weapon implementation, UI assets | Yuxin |
| Project Manager | Project management experience | Progress coordination, task management | Shiho |

---

### Responsibility Management and Flexible Collaboration

We defined clear ownership responsibilities across the entire project, ensuring that each member was accountable for a specific domain. Members were expected to take initiative in their area by conducting preliminary research, involving others when necessary, and driving development proactively.

In addition to the overall project roles, we also defined specific responsibility areas within game development. Each member was responsible for implementing their assigned features while considering how they would be technically implemented. When difficulties arose, they were discussed during daily stand-up meetings, where members sought feedback and support from others. For example, during the mid-development stage, when integration between multiple features was required (such as the control panel and weapon pickup system), there was frequent exchange of questions about each other’s code and discussions regarding feature implementation.

At the same time, challenges and development tasks were not handled individually. Instead, the entire team worked collaboratively to solve problems and progress development. For example, for large and labor-intensive tasks such as terrain initial design and weapon effect design, we formed small groups when necessary to improve development efficiency.

To support collaboration and development, we used the following tools for version control, communication, planning, and scheduling. 

<h3 align="center">Collaboration Tools Used</h3>

| Category | Tool | Purpose |
|----------|------|---------|
| Version Control & Development | GitHub | Code sharing, storage, and integration |
| Communication | Microsoft Teams | Daily stand-up meetings for progress tracking, goal setting, and task coordination |
| Communication | WhatsApp | Team communication for discussing issues, development updates, and unexpected problems |
| Project Planning | Gantt chart (Excel) | Task decomposition, role organisation, and overall progress tracking against the schedule |
| Project Management | Kanban Board (GitHub) | Visualization of detailed task progress and issue-handling progress |
| Schedule Management | Outlook Calendar | Meeting scheduling and sharing individual availability, including during holiday periods |

<p align="center">
  <img src="images/Meeting%20records.png" width="800">
</p>

### Shared Development Approach

To support collaborative problem-solving and development, we adopted the agile methodology learned in class. Throughout the entire project period, including the Easter break, we conducted daily stand-up meetings both online and in person to review task progress and identify issues.

In addition, we held in-person sessions approximately every two weeks, securing a meeting room to ensure focused on-site collaborative development time. During these sessions, we carried out pair programming and performed code merging through direct discussions in front of monitors with the relevant task owners, which contributed to improved development efficiency.

<p align="center">
  <img src="video/Inperson meeting gif.gif" width="500">
</p>


### Project Management Tools Usage and Challenges

During meetings, the Gantt chart schedule was used as a visual tool to understand the current position within the overall project timeline. This enabled us to evaluate task distribution, monitor workload balance, and assess whether tasks were progressing as planned or at risk of delay. In addition, detailed tasks within each area of responsibility, as well as newly arising tasks identified during daily stand-up meetings and day-to-day communication, were individually registered by each member on the Kanban board for progress tracking. This must help prevent tasks that emerged spontaneously from being forgotten or overlooked.

<h3 align="center">Gantt chart schedule</h3>

<p align="center">
  <img src="images/Gantt%20chart.png" width="600">
</p>

<h3 align="center">Kanban board</h3>

<p align="center">
  <img src="images/Kanban%20Board.png" width="600">
</p>

We went through a period of trial and error in how we used project management tools. During the development phase, we prioritised implementation work, which meant that updates to the Gantt chart and Kanban board were not always maintained consistently. As a result, task progress visibility decreased at certain stages, and we occasionally relied on individual memory and informal communication to track ongoing work. 

This experience revealed that when these tools are treated as supplementary documentation, their accuracy rapidly deteriorates, reducing project visibility. As a result, it becomes difficult for all team members to maintain a shared understanding of game development progress and required tasks.

---

### Improvements in Project Management Process

We frequently held both online and in-person meetings; however, in the early stages, discussions often took around two hours. To improve efficiency, we began preparing a one-slide agenda outlining the meeting objectives in advance and sharing it with all participants. This allowed everyone to align on the purpose of the meeting beforehand, enabling more efficient discussions and reducing meeting time to within one hour.

The meetings followed the structured flow below:

- Confirmation of the agenda and meeting objectives
- Progress updates for each task (ensuring no member was without assigned work)
- Identification of issues in each task
- Discussion of possible solutions to the identified issues

<h3 align="center">Daily Meeting Agenda Slide</h3>

<p align="center">
  <img src="images/DailyMeeting%20agenda.png" width="600">
</p>

In addition, since all members were continuously dedicating significant effort to game development tasks throughout the project period and signs of fatigue were observed, we implemented measures to ensure a balanced workload and reduce stress during breaks. Before holiday periods, each member’s schedule was shared in advance via Outlook calendars, allowing others to cover tasks as needed and minimizing unnecessary communication during that time.

<p align="center">
  <img src="images/Outlook calendar.png" width="700">
</p>

### Improvements in Version Control and development Process 

In addition, during collaborative development, several issues occurred when merging individual members’ code into the main branch. For example, some pull requests were merged without being noticed or approved, resulting in certain functionalities not being reflected. In other cases, changes made to shared classes affected other members’ features, and code was pushed to the main branch in a non-functional state. As a result, the main branch was not consistently kept up to date, and these issues occurred multiple times. These problems were mainly caused by the lack of a clearly defined branching and review process during parallel development, as well as our tendency to prioritise completing our own tasks over reviewing others’ work.

To address these problems, we established the following process during daily meetings and ensured that all team members strictly followed it: 

<h3 align="center">Revised Git Merge Process</h3>

<p align="center">
  <img src="images/Merge%20process.png" width="500">
</p>

<p align="center">
  <img src="images/Mergeprocess%20chat.png" width="600">
</p>

---

- 15% ~750 words

- Teamwork. How did you work together, what tools and methods did you use? Did you define team roles? Reflection on how you worked together. Be honest, we want to hear about what didn't work as well as what did work, and importantly how your team adapted throughout the project.

### Conclusion

- 10% ~500 words
- Reflect on the project as a whole. Lessons learnt. Reflect on challenges. Future work, describe both immediate next steps for your current game and also what you would potentially do if you had chance to develop a sequel.
  
Our game provided valuable experience in developing a complete interactive game system, from core gameplay mechanics to visual feedback and user interaction. One of the most important lessons learned was the necessity of designing modular and extensible systems early on. For example, the explosion system (explosion.js) was initially intended to handle basic visual effects, but it gradually evolved into a central framework supporting multiple weapon behaviors, terrain interaction, and feedback effects. This highlighted the importance of anticipating future extensions when structuring core systems.

A key challenge throughout the game was managing the interaction between different gameplay layers, particularly projectile physics, collision detection, and weapon-specific behaviors. Implementing features such as the StarShot required coordinating multiple systems: mid-air projectile splitting, secondary projectile handling, and delayed explosion upon impact. Debugging these interactions was complex, as errors often emerged from system integration rather than isolated components. This process reinforced the importance of clear responsibility boundaries between classes (e.g., projectile vs. explosion vs. match controller) and systematic debugging strategies.

Another challenge was ensuring consistent visual and gameplay feedback. Effects such as explosions, trajectory previews, and impact animations needed to feel responsive and readable while remaining performant. Balancing clarity and visual richness required iterative refinement, particularly when multiple effects occurred simultaneously (e.g., explosions, terrain deformation, and screen shake).

If development were to continue, immediate next steps would include improving game balancing and polish, such as refining weapon parameters, enhancing visual consistency across all effects, and optimizing performance for more complex interactions. Additionally, improving the user interface and feedback systems—for example, clearer hit indicators, smoother animations, and better onboarding—would significantly enhance player experience.

For a potential sequel, our game could expand into a more advanced system with dynamic environments, more complex weapon interactions, and multiplayer capabilities. Introducing features such as destructible terrain variations, weapon synergies, or adaptive AI would deepen gameplay strategy. Furthermore, restructuring the codebase into a more scalable architecture (e.g., component-based systems or event-driven design) would better support long-term development and feature expansion.


### Contribution Statement


*All members contributed equally; names are listed in alphabetical order and do not reflect level of contribution.*

| Name    | Key contribution |
|---------|----------------------------|
| Hsinman | Control panel (power and angle adjustment, weapon selection, shooting button, cannon movement limit logic), Keyboard controler, background design |
| Nikolay | AI player implementation, Terrain effects, Game results screen, Cannon trajectory logic, Turn controller logic, Cannon design |
| Shiho   | Score calculation logic, Start screen (mode selection), Weapon and explosion effects (Bubblegumshot, Impactgun, Earthworm), Weapon character design |
| Yinuo   | Weapon shop screen, Terrain effects,TrajectoryPreview logic，Weapon trajectory effects, Weapon and explosion effects (Lazershot, Grapshot, Submarineshot) |
| Yuqi    | Random events (wind, acid rain, and earthquake effects), Tutorial screen, Test code, Weapon character design |
| Yuxin   | Scoreboard display, Aiming and shooting interaction, Explosion logic, Turn display, Weapon trajectory effects, Weapon and explosion effects (ShibaShot, Pineappleshot, Starshoot), Weapon character design |


- Provide a table of everyone's contribution, which *may* be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Please let us know as soon as possible if there are any issues with teamwork as soon as they are apparent and we will do our best to help your team work harmoniously together.

### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5% of report grade) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.
- **Documentation** of code (5% of report grade)
  - Organise your code so that it could easily be picked up by another team in the future and developed further.
  - Is your repo clearly organised? Is code well commented throughout?

### Rreference
<a name="ref1"></a> [1] Wikipedia contributors. (2024). *God object*. Wikipedia, The Free Encyclopedia. Available at: [https://en.wikipedia.org/wiki/God_object](https://en.wikipedia.org/wiki/God_object) (Accessed: 20 April 2026).
