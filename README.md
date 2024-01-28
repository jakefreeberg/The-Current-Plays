## The Current Plays

This is a NextJS Project that with one API endpoint and one client page. The API endpoint will scrape the playlist for a singe day at a radio station. The UI allows you to load the playlists in to a table and filter it based on artists.

The overall goal is to help the user see how often each artists has been played on the radio station over a span of days. A monthes worth of data takes a few minutes to load, but works well.

This repo targets [Minnesota Public Radio's The Current](https://www.thecurrent.org/playlist/), but could be forked to support other radio stations.

> **Please Note:** You are likely to run in to problems running this app in a Vercel Hobby account because the 10 second limit on api requests won't be enough time to pull and process a playlist. I run mine on Heroku and it was extremely easy to set up.
