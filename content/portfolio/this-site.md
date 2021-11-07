---
listType: portfolio
title: My personal website
lede: You're looking at it right now!
date: 2015-07-28
repo: 
    url: https://github.com/jaysee00/jaysee.id.au
hero:
    url: /images/bg-hero-2.jpg
    description: Blank
tags:
    - JavaScript
---
This website has been a work in progress for as long as I can remember. Or, at least, for so long that I can't really remember exactly when I first started working on it.

My first experience "hosting" content on the web was in high school. For an English assignment, I had to write a reflective piece from the perspective of the protagonist in a book and utilise some form of multi-media. I decided to write the assignment as though it was a blog and created a website to hose this fictional character's blog. It was terrible. I didn't really know anything about HTML or CSS and used Macromedia Dreamweaver to build the site. I didn't know how to change the font of the web page, so I wrote the content in Microsoft paint and then screenshotted the paint files and embedded them into the page to get the look I wanted. It was 2001, and I was young, but I'm sure this web design sin will show up on my permanent record at the pearly gates!

This site itself has been through multiple incantations - none of which really had any longevity that resulted in this being a "permanent" website.  The earliest version I can remember was built using an open source .NET blogging engine.  I wrote one blog entry, which was a scathing review of the installation and first login experience for Star Wars: The Old Republic. I never updated it after that single entry (I also didn't really play SW:TOR much after that). I hosted the site using the free web hosting space offered by my ISP.

From there, I rebuilt the site using Bootstrap in 2014 (it was the hot thing to do at the time!) and ran the site using a Flask on Heroku (both Flask and Heroku were also hot at the time!)

In 2019 my team at work had started using Contentful and I thought it was pretty awesome! I rebuilt the site using Contentful as a content source and a React front-end using the [`react-static`](https://github.com/react-static/react-static) site generator. I also migrated from Heroku to Netlify to run the site as a totally static app.

The current iteration of this site, which I hope will be fairly permanent, is built using a custom static site renderer. I realised over time that I was falling into an anti-pattern of rewriting this site into a "new" technology over and over again. This time I've just got a Node.js build script that slurps up a bunch of Markdown files, and renders them with templates to an output directory.

I'm trying to minimise the use of complex third-party dependencies such as a CMS, CSS theme libraries, full blown frameworks like React & Vue or a complex static site generator. This is often the **wrong** approach in professional contexts, but good in this case because it minimises the need to constantly work on keeping this site up-to-date with the pace of change of the third party code. 

I don't want to constantly need to spend time on this project making sure that is hasn't broken because of downstream changes or vulnerabilities.

 The most complex dependencies in this project are `handlebars` as a template renderer, and `marked` as a markdown formatter. Both of these dependencies are quite mature and stable and unlikely to require massive changes in the future. 

I haven't yet added any complex resource bundling to this site. I hope I won't need to, because I think something like `webpack` falls into the category of complex dependencies I want to avoid using. On the other hand, I certainly don't want to build my own resource bundler from scratch. Time will tell!

