# count-mate

Introducing the Bottle, Cans, and Glass Bottle Counting App

In bustling truck stops, where noise fills the air and hands are perpetually occupied, keeping track of containers—whether bottles, cans, or glass bottles—can be a challenging task. Imagine a weary trucker sorting through heaps of rubbish, trying to tally the discarded items without missing a beat. This is precisely where our innovative app steps in.

Key Challenges and Constraints:

Hands-Free Interaction: Our app must operate entirely hands-free. Users won’t have the luxury of tapping screens or pressing buttons.
Noisy Environment: Truck stops are cacophonous places, with engines roaring, conversations echoing, and metal clanging. The app needs to function seamlessly despite this auditory chaos.
Long Silences: Truckers occasionally pause between counting items. The app should recognize these silences without prematurely resetting the count.
Essential Features:

Voice-Activated Counting: Users simply speak aloud the numbers—whether “one,” “two,” or any other—and the app incrementally tallies the containers.
Audio Feedback: After each count, the app provides immediate audio cues—a reassuring beep or a spoken confirmation—so users know their input was registered.
Pause Detection: When a user momentarily stops speaking (perhaps to catch their breath or assess the pile), the app remains patient, waiting for the next spoken number.
Reset Command: A simple “reset” voice command allows users to start counting from scratch whenever needed.
Potential Solutions:

Voice Recognition: We’ll integrate a robust voice recognition library to accurately capture spoken numbers.
Noise Filtering: Advanced noise cancellation techniques will enhance voice recognition even amidst the truck stop’s clamor.
Threshold-Based Pause Detection: By setting a threshold for silence duration, we’ll differentiate between pauses and the end of a counting session.
Feedback Sounds: A subtle sound after each count will provide users with real-time confirmation.
User Interaction Flow:

App Launch: The user initiates the app—perhaps by voice command or a quick gesture.
Start Counting: With a simple “start counting,” the app activates its listening mode.
Counting Process: As the user verbally counts (“one,” “two,” etc.), the app keeps track. Pauses are acknowledged without interruption.
Pause and Resume: If the user needs a break, saying “pause” temporarily halts the counting. To resume, they say “resume.”
Reset and Exit: “Reset” starts the count anew, while “stop” or a similar command exits the counting mode.

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with React and Chakra UI.

- Vite
- React
- Chakra UI

## Setup

```sh
git clone https://github.com/GPT-Engineer-App/count-mate.git
cd count-mate
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
