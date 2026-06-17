module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        alias: {
          '@app/config':     '../../packages/config/src',
          '@app/theme':      '../../packages/theme/src',
          '@app/ui':         '../../packages/ui/src',
          '@app/core':       '../../packages/core/src',
          '@app/auth':       '../../packages/auth/src',
          '@app/loans':      '../../packages/loans/src',
          '@app/documents':  '../../packages/documents/src',
          '@app/navigation': '../../packages/navigation/src',
        },
      }],
    ],
  };
};
