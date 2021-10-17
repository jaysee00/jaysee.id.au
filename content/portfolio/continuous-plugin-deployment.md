---
behaviour: portfolioBlog
title: Bamboo CD Plugin
lede: Continuous deployment for plugins
date: 2011-12-30
repo:
    url: https://bitbucket.org/atlassianlabs/bamboo-continuous-plugin-deployment/
hero:
    url: /images/bamboo-cd-hero.png
    description: Blank
tags:
    - Java
---

In 2011, Continuous Deployment was a hot new buzzword at Atlassian. Teams across the company were grappling with how to rapidly integrate and deploy work to shorten feedback cycles and detect breakages sooner. A particularly impressive achievement at around this time (for which I can take no credit) is when the Confluence team was able to run daily deployments of Confluence from the main branch to the Confluence site used day-to-day by the entire company. 

At the time, I was primarily working on plugins built by Atlassian for Confluence using our "Plugins 2" framework; an extensibility platform for running third-party code inside Jira, Confluence and other Atlassian server products. 

Unlike its predecessor, "Plugins 1", the Plugins 2 framework could support hot reloading of plugins in a running parent product. Additionally, the universal plugin manager (itself a plugin!) had recently exposed a REST API for installing and un-installing plugins.

I had the idea to build a custom task for Bamboo that allowed Bamboo builds to trigger the installation of an Atlassian plugin into a remote Atlassian product container. Of course, custom tasks for Bamboo are also built using the Plugins 2 framework.

So, I built a plugin that communicated with another plugin to allow the deployment of a plugin (Yo Dawg, I heard you like plugins... etc.)

My first "customer" was the team working on Team Calendars for Confluence, who started using it from the earliest published version to automate deployment of the Team Calendars plugin to Atlassian's internal Confluence site. 

I was excited to share this development with the broader third-party Atlassian ecosystem, so I gave a small presentation at AtlasCamp 2011 to share this plugin with other plugin developers (click on the image below to watch the presentation).

[![AtlasCamp 2011 - Continuous Deployment for Atlassian Plugins
](https://img.youtube.com/vi/wv7-KC37Vc4/0.jpg)](https://www.youtube.com/watch?v=wv7-KC37Vc4)

Today (ten years later!) this plugin is still installed in over 120 Bamboo servers around the world and is actively maintained and kept up-to-date by the Bamboo core engineering team.

