---
behaviour: portfolioBlog
title: Spotify for Bitbucket
lede: For pull requests like music to your ears.
date: 2015-07-28
repo: 
    url: https://bitbucket.org/atlassianlabs/spotify-plugin-for-bitbucket-server
hero:
    url: /images/spotify-plugin-hero.png
    description: Blank
tags:  
    - Java
---
One of my sillier ShipIt entries was a Spotify plugin for Bitbucket Server. I thought it would be funny if the creator of a pull request could choose some music to accompany the pull request for the reviewer(s). After all, sometimes getting some code to finally work can be an emotional experience! 

At the time, Spotify had a Web API that allowed for simple queries of their music catalogue. I was able to combine this API with the Spotify web player into a plugin for Bitbucket Server. When creating the pull request, the creator could now also optionally select a song from spotify to accompany the pull request. When a reviewer loaded the pull request view, the spotify web player would display in a sidebar on the right and load the selected song. 

Bitbucket's pull request view was not designed to be extensible, so the way this worked was a total hack. On DOM load, some custom JavaScript would forcibly inject some new input controls into the view for selecting the track and the track details would be persisted by appending a special magic string to the end of the pull request description. 

This is exactly the kind of insecure and un-managed chicanery that we now try to minimise and prevent in Atlassian's extensibility frameworks - but at the time, it worked and it got a few laughs!

I did end up actually publishing this plugin on the Atlassian Marketplace, and it was downloaded and used by a few others.

Unfortunately, the Web API was eventually deprecated by Spotify, so the plugin no longer works.