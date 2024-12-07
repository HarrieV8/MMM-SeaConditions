# MMM-SeaConditions
A MagicMirror² module for displaying sea conditions.

This version gives sea surface temperatures for a given location, 
but in the future I may include other conditions like waves, air temperature and wind.

Module displays a bar graph for a week, including 3 days forecast.

![Example of MMM-Template](./example_1.png)

[Module description]

## Installation

### Install

In your terminal, go to your [MagicMirror²][mm] Module folder and clone MMM-SeaConditions:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/HarrieV8/MMM-SeaConditions

```

### Update

```bash
cd ~/MagicMirror/modules/MMM-SeaConditions
git pull
```

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```js
    {
        module: 'MMM-SeaConditions',
        position: 'lower_third'
    },
```

Or you could use all the options:

```js
    {
        module: 'MMM-SeaConditions',
        position: 'lower_third',
        config: {
            exampleContent: 'Welcome world'
        }
    },
```

This module uses a rapidAPI.com API, documentation can be found here:
https://rapidapi.com/pavelzusko/api/sea-surface-temperature 

Register at the site to get your API key. 
They currently offer a free plan (date 25-11-2024!) that allows for 100 calls per month, 
so I have kept the default refresh rate at once a day. 

## Configuration options

Option|Possible values|Default|Description
------|------|------|-----------
`lat`|`-90` -  `90` | `52.1107` (North Sea near The Hague)| Latitude of sea location 
`lon`|`-180` -  `180` | `4.2626` (North Sea near The Hague)| Longitude of sea location
`updateInterval`| |`24` | update interval of content in hours. See section API documentation
`units`|`Celcius`, `Fahrenheit` | Celcius | show temps in Celcius or Fahrenheit

## Sending notifications to the module

Notification|Description
------|-----------
`TEMPLATE_RANDOM_TEXT`|Payload must contain the text that needs to be shown on this module

## Developer commands

- `npm install` - Install devDependencies like ESLint.
- `npm run lint` - Run linting and formatter checks.
- `npm run lint:fix` - Fix linting and formatter issues.

[mm]: https://github.com/MagicMirrorOrg/MagicMirror
