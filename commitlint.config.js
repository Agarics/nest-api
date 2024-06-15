module.exports = {
  extends: ['cz'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'WIP',
      ],
    ],
    'type-empty': [2, 'never'],
    'subject-empty': [0, 'never'],
  },
};
