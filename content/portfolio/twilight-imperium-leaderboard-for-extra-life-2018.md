---
behaviour: portfolioBlog
title: Twilight Imperium Leaderboard for Extra Life 2018
# TODO: Add lede, publish date, and repo URL.
repo: https://github.com/jaysee00/ti4-overlay
hero:
    url: /images/ti-stream-with-overlay.png
    description: A screenshot of our charity livestream event with a custom overlay showing a game leaderboard. The leaderboard is written in React.
---   
Every year, a group of folks from the [Atlassian Austin office](https://www.atlassian.com/company/careers/austin) team up for [Extra Life](https://www.extra-life.org/); a 24 hour gaming marathon to raise money for sick kids and children's hospitals around the world.

For 2018, we decided to play and live stream a game of [Twilight Imperium](https://en.wikipedia.org/wiki/Twilight_Imperium). It's a sprawling board game of galactic conquest with six players, a bunch of rules, hundreds of game pieces, various unpronouncable alien species and it takes about 8 hours to play a single game. If you're like me, that sounds like a day well spent!

I had recently started dipping my toes into [React](https://reactjs.org/) development and decided I could build a little JavaScript widget to spice up the live stream.

So, I created a React application (using `create-react-app`) that hosted a webpage with a hard-coded 1080p page size that could easily be overlaid on a 1080p live stream. The page had a background image that acted as the 'main' overlay (using stock images from the Extra Life streamer kit). On the left of the page was a dynamic react component that polled the Extra Life API to keep track of how much money each player had raised for the event. Alongside this was space to track the chosen race, color and victory points of that player. I ran out of time to implement a persistence layer behind the web application, so the player details and victory points were edited by hand in the App.js and then picked up the dev server hot reloading the component. 

I then used [StreamLabs OBS](https://streamlabs.com/) to configure a stream from our webcam with a 'web page' overlay pointing at the local Node dev server. The stream automatically refreshed the web page once every few seconds and... voila!

In the future, the player components in this app could be extracted into a general purpose 'score tracking' app for Twilight Imperium. A future project, perhaps.
