# `react-frequency`

A simple React component which creates a frequency and play it !

[Live Demo](https://codesandbox.io/s/react-frequency-0t7tt?file=/src/App.js)

![img](./screenshots/react-frequency.gif "react-frequency")

## Installation

_npm_

```sh
npm install react-frequency
```

_yarn_

```sh
yarn add react-frequency
```

## Usage

```js
import React from 'react';
import { Frequency } from 'react-frequency';

const App = () => (
  <Frequency
    type="center"
    gain={1}
    frequency={174}
  />
);
```
The component does not return any elements.<br/>
It emits a frequency generated thanks to the AudioContext API of JavaScript.

## Props

| Name        | Default           | Description  |
| ------------- |:-------------:| -----:|
| `type`      | 'center' | The type defines from which side the sound will come out.<br/>Values can be "left", "center" or "right" |
| `gain`      | 1      | The gain defines the ability to increase the strength of a signal.<br/>Value is float between 0 and 1 |
| `frequency` | 174      | The frequency corresponds to the number of vibrations per second.<br/>The human ear hears values ranging from 20Hz to 20,000Hz  |
