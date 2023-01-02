module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      psiStrategy: ['desktop', 'mobile'],
      numberOfRuns: 3,
      isSinglePageApplication: true,
      settings: {
        onlyCategories: ['accessibility', 'performance', 'best-pratices', 'seo',
        ],
      },
      assert: {
        preset: 'lighthouse:no-pwa',
        assertions: {
          'categories:performance': ['warn'],
          'categories:accessibility': ['warn'],
          'categories:best-practices': ['warn'],
          'categories:seo': ['warn'],
        },
      },
      upload: {
        target: 'temporary-public-storage',
      },
    },
  },
};
