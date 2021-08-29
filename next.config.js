module.exports = {
  reactStrictMode: true,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
      },
      use:['@svgr/webpack'],
    });

    return config;
  }
}
