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

- 15% ~750 words
- Early stages design. Ideation process. How did you decide as a team what to develop? Use case diagrams, user stories. 

### Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams. 

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the TWO areas of *technical challenge* in developing your game. 

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

1. *add proposed solution to player phase indicator problem*
2. Extra text should be added to the turn counter which should show the total turns in the match, for example - Turn 3/5, rather than just Turn 3.
3. While it is part of the gameplay challenge for players to have to estimate the correct angle and power necessary to accurately hit the enemy player, an easy mode in which either the partial or full trajectory of a shot is shown before firing would be a good and useful addition, especially when taking into consideration the requirements of future evaluations.
4. The team disagreed about this critique constituting a real issue. The suggestion to add some sort of either visible or invisible walls at the left top and right edges of the screen which would cause shots to explode or bounce could be an interesting addition (especially the bouncing variation) but not one that the team would like to prioritise, currently.
5. Adding quality of life additions such as hotkeys for the shoot button and the move pad widget is a welcome and straightforward addition to implement.
6. This should be resolved by reducing the number of times cannons can move in a single match to somewhere in the range of 2 to 4 times. As each player cannon start at a random position close to the opposite sides of the screen, making this change would make it much less likely for such a situation to occur. If it does occur, the original behaviour as described above is logical and should be preserved.
<br/>
<br/>

#### Quantitative: NASA Task Load Index (NASA-TLX) and System Usability Survey (SUS)

The number of valid samples for both the NASA-TLX and SUS questionnaires was 10. This analysis aims to investigate whether there is a significant difference between the easy and hard levels in perceived workload and usability. The tables below present the total scores for the easy and the hard level in both NASA-TLX and SUS.

<p align="center"><strong>Table x.<strong> Score of NASA-TLX and SUS</p>

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

$
\left\{
  \begin{aligned}
  H_0 &: \text{There's no significant difference between the easy and hard levels.}\\
  H_1 &: \text{There's significant difference between the easy and hard levels.}\\
  \end{aligned}
\right.
$

</p>

<p align="center"><strong>Table x.<strong> Wilcoxon Signed-Rank Test Results for NASA-TLX Scores Between Easy and Hard Levels</p>

<div align="center">

|Metric|W|p-value|Interpretation|
|:------------------|------:|------:|:---------------------------|
|Mental Demand|1.500|0.0938|No statistically significant difference|
|Physical Demand|5.500|0.6875|No statistically significant difference|
|Temporal Demand|4.500|0.5625|No statistically significant difference|
|Performance|0.000|0.0078|Statistically significant difference|
|Effort|0.0000|0.0078|Statistically significant difference|
|Frustration|1.000|0.0625|No statistically significant difference|
|Total|3.000|0.0098|Statistically significant difference|

</div>

**SUS**

### Process 

- 15% ~750 words

- Teamwork. How did you work together, what tools and methods did you use? Did you define team roles? Reflection on how you worked together. Be honest, we want to hear about what didn't work as well as what did work, and importantly how your team adapted throughout the project.

### Conclusion

- 10% ~500 words

- Reflect on the project as a whole. Lessons learnt. Reflect on challenges. Future work, describe both immediate next steps for your current game and also what you would potentially do if you had chance to develop a sequel.

### Contribution Statement

- Provide a table of everyone's contribution, which *may* be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Please let us know as soon as possible if there are any issues with teamwork as soon as they are apparent and we will do our best to help your team work harmoniously together.

### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5% of report grade) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.
- **Documentation** of code (5% of report grade)
  - Organise your code so that it could easily be picked up by another team in the future and developed further.
  - Is your repo clearly organised? Is code well commented throughout?
