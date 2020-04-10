// This is where project configuration and plugin options are located. 
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'Flattening the curve',
  titleTemplate: (title) => title ? `${title}` : 'Flattening the curve',
  plugins: [
    {
      use: 'gridsome-plugin-gtm',
      options: {
        id: 'GTM-MGRZK7F',
        enabled: true,
        debug: false
      }
    }
  ]
}
