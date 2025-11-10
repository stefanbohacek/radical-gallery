# Radical Gallery: 11ty Version

You can use either the finished `example` or the `base-project`.

## Prepare for development

1. Install project dependencies:

```sh
npm install
```

2. Get your Neocities API key from `https://neocities.org/settings/YOURSITENAME#api_key`.
3. Save your Neocities API key inside the `.env` file.

## Update your site

Add your images to `images/gallery`. Then update the following files:

- `_data/site.json`: update the information about your site
- `_data/images.json`: add information about your images

```json
[
  {
    "src": "images/gallery/example.png",
    "width": 736,
    "height": 1084,
    "title": "Image title",
    "alt": "A short description of what's in the image for users of screen readers.",
    "caption": "More details about the image, like source, or copyright information."
  },
  // more images... 
]
```


## Start a local 11ty server

```sh
npm start
```

Your site will be available at `http://localhost:8080/`.

## Upload your site to Neocities

```sh
npm run upload
```