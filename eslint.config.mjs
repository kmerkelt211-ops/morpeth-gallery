import nextVitals from 'eslint-config-next/core-web-vitals'

const config = [
  ...nextVitals,
  {
    ignores: ['sanity/static/**'],
  },
]

export default config
