---
behaviour: portfolioBlog
title: AtlasShipped
lede: DIY global package shipping
date: 2015-07-28
repo:
    private: true
hero:
    url: /images/atlasshipped-herobg.png
    description: Blank
tags: 
    - Python
---

In 2013, I partnered with a colleague from work to build "ShipIt-ShipIt" - a ShipIt entry to help Atlassian employees ship packages around the world. As a company with a global employee footprint, there is often a need to ship t-shirts, small mementos and bits and pieces around the world.

Instead of sorting out inter-office postage and couriers for trivial items we built ShipIt-ShipIt, allowing Atlassians to look and see who is flying to and from different Atlassian offices and who might be able to carry a small parcel for them.

![ShipIt ShipIt Home Page](/images/shipit-shipit-home.png)

The app worked by logging in to our internal corporate travel booking service and parsing the details of upcoming travel bookings. Unfortunately the travel service didn't have a real API of any kind. So, the secret sauce that made this work was an automated WebDriver background task that logged in to the travel service's admin interface, generated and downloaded a CSV travel report and then parsed the downloaded CSV.

Over the next two years, my partner in crime left Atlassian and I put in the extra effort to tidy things up and put the service in production. We also did a follow-up ShipIt entry with the events team to cross-reference upcoming travel with the locations of Atlassian User Groups and then email travellers with an invitation to attend a local user group. 

Working on this project was my first foray into writing Python for something other than local scripting. I learned a lot about Django, Flask, Celery and other common Python packages. Additionally, this was the first microservice I built and ran on Atlassian's internal PaaS. As such, it was a great way to learn about building 12 factor apps as my career took me away from engineering and into product management. 

AtlasShipped was retired in February 2020, after nearly five years in production operation. It became too much work to  keep the thing operational - making sure the WebDriver task didn't break every time the upstream service changed their user interface became too great. A great cautionary tale in relying on WebDriver semantics for production use cases :)

Over the years many Atlassians benefited from AtlasShipped. My favourite story is when an Atlassian's girlfriend travelled to from SF to Europe but forgot her camera. Using AtlasShipped, the camera was carted to our Amsterdam office by a good samaritan who had an upcoming flight and the camera was reunited with its owner.  The boyfriend earned major brownie points and I like to think I take a share of those, too! ;)
