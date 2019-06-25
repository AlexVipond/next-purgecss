const path = require('path')
const glob = require('glob-all')
const PurgecssPlugin = require('purgecss-webpack-plugin')

module.exports = ({
  purgeCssEnabled = ({ dev, isServer }) => true,
  purgeCss = {},
  purgeCssPaths = ['pages/**/*', 'components/**/*'],
  webpack,
  ...nextConfig
} = {}) => ({
  // pass nextConfig
  ...nextConfig,

  // overwrite webpack config
  webpack: (webpackConfig, { dev, isServer }) => {
    // Don't add plugin unless PurgeCSS is enabled
    if (!purgeCssEnabled({ dev, isServer })) {
      return webpackConfig
    }

    webpackConfig.plugins.push(
      new PurgecssPlugin({
        paths: () =>
          glob.sync(
            purgeCssPaths.map(p => path.join(webpackConfig.context, p)),
            {
              nodir: true
            }
          ),
        ...purgeCss
      })
    )

    if (typeof webpack === 'function') {
      return webpack(webpackConfig, options)
    }

    return webpackConfig
  }
})
