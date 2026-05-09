
# Julian Wittich Music

A musician website featuring events, bio, a contact section, and a strumable bass.

## Edit Content

### Calendar

The calendar can be updated on [Google Calendar](https://calendar.google.com/calendar/u/0?cid=OGUzNTBmMTdhNzRhN2RiZDg0ZWI1OWFmNWI5YzJlODVlNjRkY2Q4ZTZjMmQ2ZWNmMWRkZGZmNjliMTk0YTZhZEBncm91cC5jYWxlbmRhci5nb29nbGUuY29t). When adding an event, be sure to format the information correctly:

- **Timezone**: If your event takes place outside of the America/New York timezone then be sure to set this.
- **Title**: Enter the name of the event venue.
- **Time**: Only the start time is displayed. The event will be displayed until the end time is reached.
- **Location**: Optionally enter the URL of a details or ticketing page.
- **Description**: Optionally add a brief description (ex: "NYC Jazz Festival" or "South Stage" or "Featuring Guest Performer"). Formatting will be ignored.
- **Calendar**: Make sure it is saved to the `Julian Wittich Music` calendar.

![Example Google Calendar Event](https://raw.githubusercontent.com/pjflanagan/julianwittichmusic/main/readme/ExampleEvent.png)

### Copy 

The site's copy is managed through a few blog posts on [Blogger](https://www.blogger.com/blog/posts/2761611771015880407?hl=en&tab=jj). When editing a section be sure to use the HTML view to prevent unwanted formatting from being added. Available tags:
- `p`: be sure to wrap all paragraphs in `<p>` tags
- `a`: link (be sure to include `target="_blank"` on link tags so they open in new pages)
- `b`: bold
- `i`: italics

<!-- ### Images TODO: -->

<!-- ## Monitor

Site analytics are tracked on [Google Analytics](https://analytics.google.com). -->

## Development

### Local Dev

1. Clone the repo
2. Install with `npm i`
3. Run the local Netlify server (you may have to run `nvm use` first)
4. To see content, you will have to recreate a `.env` file using the keys found on Netlify

```
$ netlify dev
```

### Deploy

Merge to the `main` branch to trigger a Netlify deploy.
