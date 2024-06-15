module.exports = {
  'pre-commit': 'pnpm exec lint-staged --allow-empty --concurrent false',
  'commit-msg': 'pnpm exec commitlint --edit $1',
};
