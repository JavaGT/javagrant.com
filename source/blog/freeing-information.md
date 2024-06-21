---
title: Freeing Information
date: 2024/06/19
tags: ['freedom']
slug: freeing-information
rating: 3
emoji: ⛓️‍💥
---

This page refers to the more 'content' and 'data' kind of information: videos, podcasts, music & more.
For 'academic knowledge' (books & articles) check out [freeing-knowledge](/blog/freeing-knowledge).

## Nothing is forever
DO NOT ASSUME ANYTHING ON THE INTERNET WILL REMAIN THERE.
- Uploaders may take them down, or they may be lost/written off when intellectual property and media organisations are sold.


# Resources
https://rentry.org/firehawk52
https://champagne.pages.dev/
https://fmhy.net/beginners-guide
https://ripped.guide/
https://ori5000.github.io/musicripping.html


## Spotify and podcasts
Spotify is largely an interface for podcasts which use the [RSS](https://en.wikipedia.org/wiki/RSS) format.

This causes issues for accessing old podcast content, because RSS feeds aren't designed to go back far in time, instead being a location for listing the most recent episodes or posts in a feed.

As of today (19th June 2024) the RNZ Checkpoint Podcast [rss feed](https://www.rnz.co.nz/podcasts/checkpoint.rss) returns an the earliest episode as: 
```
<pubDate>Mon, 11 Mar 2024 16:46:00 +1300</pubDate>
<itunes:title>Oppenheimer claims best picture trophy at the Academy Awards</itunes:title>
```
while the earliest I could find by searching through the [RNZ webpage](https://www.rnz.co.nz/national/programmes/checkpoint/podcast) was an episode from [May 2007](https://www.rnz.co.nz/national/programmes/checkpoint/audio/915930/focus-on-politics-for-4-may). At time of searching, it was on the 3001st page.

In comparison, the [Spotify API](https://developer.spotify.com/documentation/web-api/reference/get-a-shows-episodes) when requesting the episodes for RNZ checkpoint responded that there were ```"total": 1000,``` episodes. Requesting the 1000th episode reveals that it is ```"href": "https://api.spotify.com/v1/episodes/5DiGRXupHLBU2KpMfIwELL",``` ```"name": "Oppenheimer claims best picture trophy at the Academy Awards", "release_date": "2024-03-11",``` The same as the RSS feed!


So, Spotify doesn't show you all the episodes of a podcast, only the ones in the current RSS feed. This makes sense, as it provides a single source of truth for the show, meaning the creator can remove it from the RSS feed and it will probably come off of all platforms that people use to listen to it. This means that the content is likely not being stored on Spotify servers, instead accessing old podcast episodes requires finding an archive of the files (and hopefully the metadata).

> Please let me know if there is another way you are aware of!

Searching through Spotify's network requests when playing the Oppenheimer Episode reveals that the audio comes from ```https://flex.acast.com/podcast.radionz.co.nz/ckpt/ckpt-20240311-1646-oppenheimer_claims_best_picture_trophy_at_the_academy_awards-128.mp3``` which redirects to ```https://stitcher2.acast.com/livestitches/ba76f3080777b5c6033e5eb0a03365f3.mp3?aid=[apparent authentication parameters]```

However, it is apparent the url after ```flex.acast.com/``` works by itself: [podcast.radionz.co.nz/ckpt/ckpt-20240311-1646-oppenheimer_claims_best_picture_trophy_at_the_academy_awards-128.mp3](podcast.radionz.co.nz/ckpt/ckpt-20240311-1646-oppenheimer_claims_best_picture_trophy_at_the_academy_awards-128.mp3)

I think this confirms that Spotify isn't storing or hosting the podcast audio files, however, they do seem to host 60s previews.
```https://podz-content.spotifycdn.com/audio/clips/7xYyZqKhhwlM0jYlEnTw2x/clip_0_60000.mp3``` is the preview of the Oppenheimer episode. It will be interesting to see if Spotify continues to host the preview as the episode slides off the end of the RSS feed.

The Spotify original podcast [The Big Picture](https://open.spotify.com/show/6mTel3azvnK8isLs4VujvF?si=314af60c53c74dd9) has [a public RSS feed](https://feeds.megaphone.fm/the-big-picture) and is therefore [available on other podcasting platforms](https://podcasts.apple.com/us/podcast/the-big-picture/id1439252196). However the audio files come from [Spotify's podcasing platform Megaphone](https://megaphone.spotify.com/). Apple podcasts serves up ```https://traffic.megaphone.fm/GLT9379274207.mp3``` which redirects to ```https://dcs.megaphone.fm/GLT9379274207.mp3``` with some event id stuff in the queryparams that isn't needed to access the file.