/* eslint-env jest */
/* eslint-disable max-len */
import { parse } from '../../..';

const transform = (output) => output.entities.urls.map((url) => url.url);

describe('urls', () => {
  it('Extract a lone URL', () => {
    const actual = parse('http://example.com');
    const expected = [ 'http://example.com' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://google.com', () => {
    const actual = parse('text http://google.com');
    const expected = [ 'http://google.com' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://foobar.com/#', () => {
    const actual = parse('text http://foobar.com/#');
    const expected = [ 'http://foobar.com/#' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://google.com/#foo', () => {
    const actual = parse('text http://google.com/#foo');
    const expected = [ 'http://google.com/#foo' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://google.com/#search?q=iphone%20-filter%3Alinks', () => {
    const actual = parse('text http://google.com/#search?q=iphone%20-filter%3Alinks');
    const expected = [ 'http://google.com/#search?q=iphone%20-filter%3Alinks' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://twitter.com/#search?q=iphone%20-filter%3Alinks', () => {
    const actual = parse('text http://twitter.com/#search?q=iphone%20-filter%3Alinks');
    const expected = [ 'http://twitter.com/#search?q=iphone%20-filter%3Alinks' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://somedomain.com/index.php?path=/abc/def/', () => {
    const actual = parse('text http://somedomain.com/index.php?path=/abc/def/');
    const expected = [ 'http://somedomain.com/index.php?path=/abc/def/' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html', () => {
    const actual = parse('text http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html');
    const expected = [ 'http://www.boingboing.net/2007/02/14/katamari_damacy_phon.html' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://somehost.com:3000', () => {
    const actual = parse('text http://somehost.com:3000');
    const expected = [ 'http://somehost.com:3000' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://xo.com/~matthew+%ff-x', () => {
    const actual = parse('text http://xo.com/~matthew+%ff-x');
    const expected = [ 'http://xo.com/~matthew+%ff-x' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://xo.com/~matthew+%ff-,.;x', () => {
    const actual = parse('text http://xo.com/~matthew+%ff-,.;x');
    const expected = [ 'http://xo.com/~matthew+%ff-,.;x' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://xo.com/,.;x', () => {
    const actual = parse('text http://xo.com/,.;x');
    const expected = [ 'http://xo.com/,.;x' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://en.wikipedia.org/wiki/Primer_(film)', () => {
    const actual = parse('text http://en.wikipedia.org/wiki/Primer_(film)');
    const expected = [ 'http://en.wikipedia.org/wiki/Primer_(film)' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://www.ams.org/bookstore-getitem/item=mbk-59', () => {
    const actual = parse('text http://www.ams.org/bookstore-getitem/item=mbk-59');
    const expected = [ 'http://www.ams.org/bookstore-getitem/item=mbk-59' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://✪df.ws/ejp', () => {
    const actual = parse('text http://✪df.ws/ejp');
    const expected = [ 'http://✪df.ws/ejp' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://chilp.it/?77e8fd', () => {
    const actual = parse('text http://chilp.it/?77e8fd');
    const expected = [ 'http://chilp.it/?77e8fd' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://x.com/oneletterdomain', () => {
    const actual = parse('text http://x.com/oneletterdomain');
    const expected = [ 'http://x.com/oneletterdomain' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL: http://msdn.microsoft.com/ja-jp/library/system.net.httpwebrequest(v=VS.100).aspx', () => {
    const actual = parse('text http://msdn.microsoft.com/ja-jp/library/system.net.httpwebrequest(v=VS.100).aspx');
    const expected = [ 'http://msdn.microsoft.com/ja-jp/library/system.net.httpwebrequest(v=VS.100).aspx' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract invalid URL: http://domain-begin_dash_2314352345_dfasd.foo-cow_4352.com', () => {
    const actual = parse('text http://domain-dash_2314352345_dfasd.foo-cow_4352.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract invalid URL: http://-begin_dash_2314352345_dfasd.foo-cow_4352.com', () => {
    const actual = parse('text http://-dash_2314352345_dfasd.foo-cow_4352.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract invalid URL: http://no-tld', () => {
    const actual = parse('text http://no-tld');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract invalid URL: http://tld-too-short.x', () => {
    const actual = parse('text http://tld-too-short.x');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract invalid URL with invalid preceding character: (http://twitter.com', () => {
    const actual = parse('(http://twitter.com');
    const expected = [ 'http://twitter.com' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a very long hyphenated sub-domain URL (single letter hyphens)', () => {
    const actual = parse('text http://word-and-a-number-8-ftw.domain.com/');
    const expected = [ 'http://word-and-a-number-8-ftw.domain.com/' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a hyphenated TLD (usually a typo)', () => {
    const actual = parse('text http://domain.com-that-you-should-have-put-a-space-after');
    const expected = [ 'http://domain.com' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URL ending with # value', () => {
    const actual = parse('text http://foo.com?#foo text');
    const expected = [ 'http://foo.com?#foo' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs without protocol on (com|org|edu|gov|net) domains', () => {
    const actual = parse('foo.com foo.net foo.org foo.edu foo.gov');
    const expected = [ 'foo.com', 'foo.net', 'foo.org', 'foo.edu', 'foo.gov' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs without protocol not on (com|org|edu|gov|net) domains', () => {
    const actual = parse('foo.baz foo.co.jp www.xxxxxxx.baz www.foo.co.uk wwwww.xxxxxxx foo.comm foo.somecom foo.govedu foo.jp');
    const expected = [ 'foo.co.jp', 'www.foo.co.uk' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs without protocol on ccTLD with slash', () => {
    const actual = parse('t.co/abcde bit.ly/abcde');
    const expected = [ 't.co/abcde', 'bit.ly/abcde' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs with protocol on ccTLD domains', () => {
    const actual = parse('http://foo.jp http://fooooo.jp');
    const expected = [ 'http://foo.jp', 'http://fooooo.jp' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs with a - or + at the end of the path', () => {
    const actual = parse('Go to http://example.com/a+ or http://example.com/a-');
    const expected = [ 'http://example.com/a+', 'http://example.com/a-' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs with longer paths ending in -', () => {
    const actual = parse('Go to http://example.com/view/slug-url-?foo=bar');
    const expected = [ 'http://example.com/view/slug-url-?foo=bar' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs beginning with a space', () => {
    const actual = parse('@user Try http:// example.com/path');
    const expected = [ 'example.com/path' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract long URL without protocol surrounded by CJK characters', () => {
    const actual = parse('これは日本語です。example.com/path/index.html中国語example.com/path한국');
    const expected = [ 'example.com/path/index.html', 'example.com/path' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract short URL without protocol surrounded by CJK characters', () => {
    const actual = parse('twitter.comこれは日本語です。example.com中国語t.co/abcde한국twitter.com example2.comテストtwitter.com/abcde');
    const expected = [ 'twitter.com', 'example.com', 't.co/abcde', 'twitter.com', 'example2.com', 'twitter.com/abcde' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs with and without protocol surrounded by CJK characters', () => {
    const actual = parse('http://twitter.com/これは日本語です。example.com中国語http://t.co/abcde한국twitter.comテストexample2.comテストhttp://twitter.com/abcde');
    const expected = [ 'http://twitter.com/', 'example.com', 'http://t.co/abcde', 'twitter.com', 'example2.com', 'http://twitter.com/abcde' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs with protocol and path containing Cyrillic characters', () => {
    const actual = parse('Go to http://twitter.com/Русские_слова');
    const expected = [ 'http://twitter.com/Русские_слова' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract short URLs without protocol on ccTLD domains without path', () => {
    const actual = parse('twitter.jp日本語it.so中国語foo.jp it.so foo.jp');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract some (tv|co) short URLs without protocol on ccTLD domains without path', () => {
    const actual = parse('MLB.tv vine.co twitch.tv t.co');
    const expected = [ 'MLB.tv', 'vine.co', 'twitch.tv', 't.co' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs beginning with a non-breaking space (U+00A0)', () => {
    const actual = parse('@user Try http:// example.com/path');
    const expected = [ 'example.com/path' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs with underscores and dashes in the subdomain', () => {
    const actual = parse('test http://sub_domain-dash.twitter.com');
    const expected = [ 'http://sub_domain-dash.twitter.com' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URL with minimum number of valid characters', () => {
    const actual = parse('test http://a.b.cd');
    const expected = [ 'http://a.b.cd' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs containing underscores and dashes', () => {
    const actual = parse('test http://a_b.c-d.com');
    const expected = [ 'http://a_b.c-d.com' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs containing dashes in the subdomain', () => {
    const actual = parse('test http://a-b.c.com');
    const expected = [ 'http://a-b.c.com' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs with dashes in the domain name', () => {
    const actual = parse('test http://twitter-dash.com');
    const expected = [ 'http://twitter-dash.com' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URLs with lots of symbols then a period', () => {
    const actual = parse('http://www.bestbuy.com/site/Currie+Technologies+-+Ezip+400+Scooter/9885188.p?id=1218189013070&skuId=9885188');
    const expected = [ 'http://www.bestbuy.com/site/Currie+Technologies+-+Ezip+400+Scooter/9885188.p?id=1218189013070&skuId=9885188' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URLs containing leading dashes in the subdomain', () => {
    const actual = parse('test http://-leadingdash.twitter.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URLs containing trailing dashes in the subdomain', () => {
    const actual = parse('test http://trailingdash-.twitter.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URLs containing leading underscores in the subdomain', () => {
    const actual = parse('test http://_leadingunderscore.twitter.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URLs containing trailing underscores in the subdomain', () => {
    const actual = parse('test http://trailingunderscore_.twitter.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URLs containing leading dashes in the domain name', () => {
    const actual = parse('test http://-twitter.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URLs containing trailing dashes in the domain name', () => {
    const actual = parse('test http://twitter-.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URLs containing underscores in the domain name', () => {
    const actual = parse('test http://twitter_underscore.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URLs containing underscores in the tld', () => {
    const actual = parse('test http://twitter.c_o_m');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL http://www.foo.com/foo/path-with-period./', () => {
    const actual = parse('test http://www.foo.com/foo/path-with-period./');
    const expected = [ 'http://www.foo.com/foo/path-with-period./' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL http://www.foo.org.za/foo/bar/688.1', () => {
    const actual = parse('test http://www.foo.org.za/foo/bar/688.1');
    const expected = [ 'http://www.foo.org.za/foo/bar/688.1' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL http://www.foo.com/bar-path/some.stm?param1=foo;param2=P1|0||P2|0', () => {
    const actual = parse('test http://www.foo.com/bar-path/some.stm?param1=foo;param2=P1|0||P2|0');
    const expected = [ 'http://www.foo.com/bar-path/some.stm?param1=foo;param2=P1|0||P2|0' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL http://foo.com/bar/123/foo_&_bar/', () => {
    const actual = parse('test http://foo.com/bar/123/foo_&_bar/');
    const expected = [ 'http://foo.com/bar/123/foo_&_bar/' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL http://www.cp.sc.edu/events/65', () => {
    const actual = parse('test http://www.cp.sc.edu/events/65 test');
    const expected = [ 'http://www.cp.sc.edu/events/65' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL http://www.andersondaradio.no.comunidades.net/', () => {
    const actual = parse('http://www.andersondaradio.no.comunidades.net/ test test');
    const expected = [ 'http://www.andersondaradio.no.comunidades.net/' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract valid URL ELPAÍS.com', () => {
    const actual = parse('test ELPAÍS.com');
    const expected = [ 'ELPAÍS.com' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT include period at the end of URL', () => {
    const actual = parse('test http://twitter.com/.');
    const expected = [ 'http://twitter.com/' ];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a URL with '?' in fragment", () => {
    const actual = parse('http://tn.com.ar/show/00056158/la-estrella-del-certamen-el-turno-de-pamela-anderson?fb_xd_fragment#?=&cb=fe17523f223b7&relation=parent.parent&transport=fragment&type=resize&height=20&ackdata');
    const expected = [ 'http://tn.com.ar/show/00056158/la-estrella-del-certamen-el-turno-de-pamela-anderson?fb_xd_fragment#?=&cb=fe17523f223b7&relation=parent.parent&transport=fragment&type=resize&height=20&ackdata' ];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a URL with '?' in fragment in a text", () => {
    const actual = parse('text http://tn.com.ar/show/00056158/la-estrella-del-certamen-el-turno-de-pamela-anderson?fb_xd_fragment#?=&cb=fe17523f223b7&relation=parent.parent&transport=fragment&type=resize&height=20&ackdata text');
    const expected = [ 'http://tn.com.ar/show/00056158/la-estrella-del-certamen-el-turno-de-pamela-anderson?fb_xd_fragment#?=&cb=fe17523f223b7&relation=parent.parent&transport=fragment&type=resize&height=20&ackdata' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a URL with a ton of trailing periods', () => {
    const actual = parse('Test a ton of periods http://example.com/path..........................................');
    const expected = [ 'http://example.com/path' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a URL with a ton of trailing commas', () => {
    const actual = parse('Test a ton of periods http://example.com/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,');
    const expected = [ 'http://example.com/' ];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a URL with a ton of trailing '!'", () => {
    const actual = parse('Test a ton of periods http://example.com/path/!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    const expected = [ 'http://example.com/path/' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URLs in hashtag or @mention', () => {
    const actual = parse('#test.com @test.com #http://test.com @http://test.com #t.co/abcde @t.co/abcde');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a t.co URL with a trailing apostrophe', () => {
    const actual = parse("I really like http://t.co/pbY2NfTZ's website");
    const expected = [ 'http://t.co/pbY2NfTZ' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a t.co URL with a trailing hyphen', () => {
    const actual = parse("Check this site out http://t.co/FNkPfmii- it's great");
    const expected = [ 'http://t.co/FNkPfmii' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract a t.co URL with a trailing colon', () => {
    const actual = parse('According to http://t.co/ulYGBYSo: the internet is cool');
    const expected = [ 'http://t.co/ulYGBYSo' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('Extract URL before newline', () => {
    const actual = parse('http://twitter.com\nhttp://example.com\nhttp://example.com/path\nexample.com/path\nit.so\nit.so/abcde');
    const expected = [ 'http://twitter.com', 'http://example.com', 'http://example.com/path', 'example.com/path', 'it.so/abcde' ];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URL if preceded by $', () => {
    const actual = parse('$http://twitter.com $twitter.com $http://t.co/abcde $t.co/abcde $t.co $TVI.CA $RBS.CA');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract .bz2 file name as URL', () => {
    const actual = parse('long.test.tar.bz2 test.tar.bz2 tar.bz2');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URL with gTLD followed by @ sign', () => {
    const actual = parse('john.doe.gov@mail.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it('DO NOT extract URL with ccTLD followed by @ sign', () => {
    const actual = parse('john.doe.jp@mail.com');
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

/* eslint-enable max-len */
});
