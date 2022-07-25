<p align="center">
  <img src="https://user-images.githubusercontent.com/26047842/177056994-e6be0cd0-6e18-40c1-a254-ae847c62ffaf.png" />
 </p>

 <p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=codegraphy.codegraphy"><img src="https://vsmarketplacebadge.apphb.com/version-short/codegraphy.codegraphy.svg" alt="Marketplace"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=codegraphy.codegraphy"><img src="https://vsmarketplacebadge.apphb.com/downloads-short/codegraphy.codegraphy.svg" alt="Marketplace"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=codegraphy.codegraphy"><img src="https://vsmarketplacebadge.apphb.com/rating-short/codegraphy.codegraphy.svg" alt="Marketplace"></a>
</p>

# CodeGraphy

> CodeGraphy **enhances** files connections inside VSCode and allows for **birds eye views** of each repository. It helps you to **visualize code hierarchy** at a glance, **seamlessly navigate and explore** your file hierarchy, **gain valuable insights** via a force based node graph UI, and so much more.

CodeGraphy is an [open-source](https://github.com/joesobo/CodeGraphy 'Open CodeGraphy on GitHub') extension for [Visual Studio Code](https://code.visualstudio.com).

Simply CodeGraphy helps you **better understand file connections**. With its force-based grpah you can get a completely different view of the architecture of your codebase and make quick informed decisions about where your code is "knotted" in the graph.

## Install CodeGraphy

Install CodeGraphy for [VSCode](https://marketplace.visualstudio.com/items?itemName=codegraphy.codegraphy)

## Features

![Main Graph](https://user-images.githubusercontent.com/26047842/180671502-63367d2a-85c3-4e20-8f2c-dedc1fada0ba.png)

### Node Graph

CodeGraphy's main feature is its ability to display the file heirarchy within the current directory and the connections within the files of the directory.

- Ability to open files directly from CodeGraphy
- Can change the style of the force-based graph
- Displays connections between files

![Full Extension](https://user-images.githubusercontent.com/26047842/180671519-b7aa7da9-e025-4685-b4ad-a5e6cb1b1264.png)

### Settings

To color in nodes of the graph add these configurations to your `settings.json`. These can be manually editted from the `Groups` section of the extension.

```json
"codegraphy.nodeSettings": [
  {
    "extension": ".js",
    "color": "#4985be"
  },
  {
    "extension": ".ts",
    "color": "#eac73e"
  },
  {
    "extension": ".vue",
    "color": "#74cc4b"
  },
  {
    "extension": ".json",
    "color": "#dc6844"
  }
]
```

![Node Group Settings](https://user-images.githubusercontent.com/26047842/180671587-65727960-e0bf-4053-82ea-3f6dac719f39.png)

## Known Issues

This extension is still a work in progress. It is subject to major changes still. As it is the extension primary works on `js` files.

- Does not include `required` connections
- Does not include custom relative pathing

## Contributing
Contributions are always welcome for CodeGraphy! Please make sure to read the [Contributing Guide](https://github.com/joesobo/CodeGraphy/blob/main/.github/CONTRIBUTING.md) before making a pull request.

## License

[MIT](https://opensource.org/licenses/MIT)

Copyright (c) 2022-present, Joe Soboleski
