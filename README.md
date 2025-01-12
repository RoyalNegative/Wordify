# Wordify
## Word Hunt Frontend

Welcome to the Word Hunt game frontend repository! This project is designed to provide an engaging and interactive experience for Twitch viewers, integrating with Twitch chat for real-time gameplay. Here, participants can test their vocabulary skills while competing for a spot on the leaderboard.

# 🎮 Gameplay Overview

## Objective:

Guess the word displayed on the screen based on its dictionary definition or daily usage example.

## Player Participation:

Only one player can guess per round.

To join the game, players must follow or subscribe to the Twitch channel.

## Scoring:

-Each correct guess adds points to the player's score.

-Scores update live on the leaderboard.

-Subscribers earn bonus points for correct guesses.

## Hints:

-Words are represented by dashes (_ _ _ _).

-A dictionary definition is provided as a primary hint.

-Daily usage examples appear occasionally as secondary hints.

# 🚀 Features

## Frontend Responsibilities

### Dynamic Word Display:

Words appear as dashes (_ _ _ _) until guessed correctly.

Updates dynamically when the backend processes a correct guess.

 ### Hint Section:

Displays dictionary definitions and optional daily usage examples.

### Player Feedback:

Real-time notifications for correct guesses.

Fun animations for correct answers (e.g., confetti, glowing word reveal).

### Leaderboard:

Displays top players with their scores.

Updates dynamically with new scores after each round.

### Game Information:

Current round number.

Active player's name (e.g., "Now guessing: Player123").

Instructions for participation (follow/subscribe).

# 📝 How to Play

## Join the Game:

-Follow or subscribe to the Twitch channel.

-Only one player can guess per round.

-Players are selected either by a queue or randomly from followers/subscribers.

## Guess the Word:

-Use Twitch chat to submit your guess (e.g., "apple").

-The system will confirm if your guess is correct.

## Score Points:

-Earn points for each correct guess.

-Leaderboard updates in real-time to reflect scores.

-Subscribers earn bonus points for their correct guesses.

## Win the Round:

Correctly guess the word to win the round and trigger the next word.

# 🖥️ Visual Layout

##Main Screen:

Word Puzzle: Centered display of dashes representing the word.

Hint Section: Definition and daily usage example displayed below the puzzle.

Player Status: Shows the current active player's name.

Leaderboard: Sidebar or footer displaying top players and their scores.

Feedback Area: Notifications for correct guesses.

Game Over/End-of-Session Screen:

Displays final leaderboard and game summary.

# 🔧 Technical Details

## Frontend Stack

HTML/CSS/JavaScript: For building the user interface.

Responsive Design: Ensures compatibility across devices and stream layouts.

## Backend Integration

Node.js: Handles Twitch API integration and real-time updates.

Twitch API: Processes chat inputs and identifies followers/subscribers.

🤝 Contributing

We welcome contributions to enhance the Word Hunt game! Feel free to submit a pull request or open an issue for discussion.

Ready to test your vocabulary skills? Follow the channel and join the fun on Word Hunt today!
