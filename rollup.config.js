import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import pegjs from 'rollup-plugin-pegjs';
import uglify from 'rollup-plugin-uglify';

const nonNull = (array) => array.filter((x) => !!x);

const optimize = process.env.PEGJS_OPTIMIZE || 'speed';
const isProduction = process.env.NODE_ENV === 'production';

const dest = nonNull([ 'build/twitter-lang', optimize, isProduction && 'min', 'js' ]).join('.');

export default {
  entry: 'src/twitter-lang.pegjs',
  dest,
  sourceMap: !isProduction,
  format: 'cjs',
  plugins: nonNull([
    pegjs({ optimize }),
    babel({ babelrc: false, presets: [ 'es2015-rollup', 'stage-1' ] }),
    isProduction ? uglify() : null,
    filesize({
      render: (options, size, gzip) => `
  Build:        ${dest}
  Bundle Size:  ${size}
  Compressed:   ${gzip}
`
    })
  ])
};
