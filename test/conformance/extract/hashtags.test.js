/* eslint-env jest */
import { parse } from '../../..';

const transform = output => output.entities.hashtags.map(hashtag => hashtag.text);

describe('hashtags', () => {

  it("Extract an all-alpha hashtag", () => {
    const actual = parse("a #hashtag here");
    const expected = ["hashtag"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a letter-then-number hashtag", () => {
    const actual = parse("this is #hashtag1");
    const expected = ["hashtag1"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a number-then-letter hashtag", () => {
    const actual = parse("#1hashtag is this");
    const expected = ["1hashtag"];
    expect(transform(actual)).toEqual(expected);
  });

  it("DO NOT Extract an all-numeric hashtag", () => {
    const actual = parse("On the #16 bus");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it("DO NOT Extract a single numeric hashtag", () => {
    const actual = parse("#0");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract hashtag after bracket", () => {
    const actual = parse("(#hashtag1 )#hashtag2 [#hashtag3 ]#hashtag4 ’#hashtag5’#hashtag6");
    const expected = ["hashtag1","hashtag2","hashtag3","hashtag4","hashtag5","hashtag6"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a hashtag containing ñ", () => {
    const actual = parse("I'll write more tests #mañana");
    const expected = ["mañana"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a hashtag containing é", () => {
    const actual = parse("Working remotely #café");
    const expected = ["café"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a hashtag containing ü", () => {
    const actual = parse("Getting my Oktoberfest on #münchen");
    const expected = ["münchen"];
    expect(transform(actual)).toEqual(expected);
  });

  it("DO NOT Extract a hashtag containing Japanese", () => {
    const actual = parse("this is not valid: # 会議中 ハッシュ");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a hashtag in Korean", () => {
    const actual = parse("What is #트위터 anyway?");
    const expected = ["트위터"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a half-width Hangul hashtag", () => {
    const actual = parse("Just random half-width Hangul #ﾣﾦﾰ");
    const expected = ["ﾣﾦﾰ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a hashtag in Russian", () => {
    const actual = parse("What is #ашок anyway?");
    const expected = ["ашок"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a starting katakana hashtag", () => {
    const actual = parse("#カタカナ is a hashtag");
    const expected = ["カタカナ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a starting hiragana hashtag", () => {
    const actual = parse("#ひらがな FTW!");
    const expected = ["ひらがな"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a starting kanji hashtag", () => {
    const actual = parse("#漢字 is the future");
    const expected = ["漢字"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a trailing katakana hashtag", () => {
    const actual = parse("Hashtag #カタカナ");
    const expected = ["カタカナ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a trailing hiragana hashtag", () => {
    const actual = parse("Japanese hashtags #ひらがな");
    const expected = ["ひらがな"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a trailing kanji hashtag", () => {
    const actual = parse("Study time #漢字");
    const expected = ["漢字"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a central katakana hashtag", () => {
    const actual = parse("See my #カタカナ hashtag?");
    const expected = ["カタカナ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a central hiragana hashtag", () => {
    const actual = parse("Study #ひらがな for fun and profit");
    const expected = ["ひらがな"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a central kanji hashtag", () => {
    const actual = parse("Some say #漢字 is the past. what do they know?");
    const expected = ["漢字"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a Kanji/Katakana mixed hashtag", () => {
    const actual = parse("日本語ハッシュタグテスト #日本語ハッシュタグ");
    const expected = ["日本語ハッシュタグ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a hashtag after a punctuation", () => {
    const actual = parse("日本語ハッシュテスト。#日本語ハッシュタグ");
    const expected = ["日本語ハッシュタグ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("DO NOT include a punctuation in a hashtag", () => {
    const actual = parse("#日本語ハッシュタグ。");
    const expected = ["日本語ハッシュタグ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract a full-width Alnum hashtag", () => {
    const actual = parse("全角英数字ハッシュタグ ＃ｈａｓｈｔａｇ１２３");
    const expected = ["ｈａｓｈｔａｇ１２３"];
    expect(transform(actual)).toEqual(expected);
  });

  it("DO NOT extract a hashtag without a preceding space", () => {
    const actual = parse("日本語ハッシュタグ#日本語ハッシュタグ");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtag with chouon", () => {
    const actual = parse("長音ハッシュタグ。#サッカー");
    const expected = ["サッカー"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtag with half-width chouon", () => {
    const actual = parse("長音ハッシュタグ。#ｻｯｶｰ");
    const expected = ["ｻｯｶｰ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtag with half-widh voiced sounds marks", () => {
    const actual = parse("#ﾊｯｼｭﾀｸﾞ #ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ");
    const expected = ["ﾊｯｼｭﾀｸﾞ","ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtag with half-width # after full-width ！", () => {
    const actual = parse("できましたよー！#日本語ハッシュタグ。");
    const expected = ["日本語ハッシュタグ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtag with full-width ＃ after full-width ！", () => {
    const actual = parse("できましたよー！＃日本語ハッシュタグ。");
    const expected = ["日本語ハッシュタグ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtag with ideographic iteration mark", () => {
    const actual = parse("#云々 #学問のすゝめ #いすゞ #各〻 #各〃");
    const expected = ["云々","学問のすゝめ","いすゞ","各〻","各〃"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract hashtag with fullwidth tilde", () => {
    const actual = parse("#メ～テレ ハッシュタグ内で～が認識されず");
    const expected = ["メ～テレ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract hashtag with wave dash", () => {
    const actual = parse("#メ〜テレ ハッシュタグ内で～が認識されず");
    const expected = ["メ〜テレ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtags with ş (U+015F)", () => {
    const actual = parse("Here’s a test tweet for you: #Ateş #qrşt #ştu #ş");
    const expected = ["Ateş","qrşt","ştu","ş"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtags with İ (U+0130) and ı (U+0131)", () => {
    const actual = parse("Here’s a test tweet for you: #İn #ın");
    const expected = ["İn","ın"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtag before punctuations", () => {
    const actual = parse("#hashtag: #hashtag; #hashtag, #hashtag. #hashtag! #hashtag?");
    const expected = ["hashtag","hashtag","hashtag","hashtag","hashtag","hashtag"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtag after punctuations", () => {
    const actual = parse(":#hashtag ;#hashtag ,#hashtag .#hashtag !#hashtag ?#hashtag");
    const expected = ["hashtag","hashtag","hashtag","hashtag","hashtag","hashtag"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Hashtag before newline", () => {
    const actual = parse("#hashtag\ntest\n#hashtag2\ntest\n#hashtag3\n");
    const expected = ["hashtag","hashtag2","hashtag3"];
    expect(transform(actual)).toEqual(expected);
  });

  it("DO NOT extract hashtag when # is followed by URL", () => {
    const actual = parse("#http://twitter.com #https://twitter.com");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it("DO NOT extract hashtag if it's a part of URL", () => {
    const actual = parse("http://twitter.com/#hashtag twitter.com/#hashtag");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract hashtags with Latin extended characters", () => {
    const actual = parse("#Azərbaycanca #mûǁae #Čeština #Ċaoiṁín");
    const expected = ["Azərbaycanca","mûǁae","Čeština","Ċaoiṁín"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Arabic hashtags", () => {
    const actual = parse("#سیاست #ایران #السياسة #السياح #لغات  #اتمی  #کنفرانس #العربية #الجزيرة #فارسی");
    const expected = ["سیاست","ایران","السياسة","السياح","لغات","اتمی","کنفرانس","العربية","الجزيرة","فارسی"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Arabic hashtags with underscore", () => {
    const actual = parse("#برنامه_نویسی  #رییس_جمهور  #رئيس_الوزراء, #ثبت_نام. #لس_آنجلس");
    const expected = ["برنامه_نویسی","رییس_جمهور","رئيس_الوزراء","ثبت_نام","لس_آنجلس"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Hebrew hashtags", () => {
    const actual = parse("#עַל־יְדֵי #וכו׳ #מ״כ");
    const expected = ["עַל־יְדֵי","וכו׳","מ״כ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Thai hashtags", () => {
    const actual = parse("#ผู้เริ่ม #การเมือง #รายละเอียด #นักท่องเที่ยว #ของขวัญ #สนามบิน #เดินทาง #ประธาน");
    const expected = ["ผู้เริ่ม","การเมือง","รายละเอียด","นักท่องเที่ยว","ของขวัญ","สนามบิน","เดินทาง","ประธาน"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Arabic hashtags with Zero-Width Non-Joiner", () => {
    const actual = parse("#أي‌بي‌إم #می‌خواهم");
    const expected = ["أي‌بي‌إم","می‌خواهم"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Amharic hashtag", () => {
    const actual = parse("የአላህ መልእክተኛ ሰለላሁ ዓለይሂ ወሰለም #ኢትዮሙስሊምስ");
    const expected = ["ኢትዮሙስሊምስ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Sinhala hashtag with Zero-Width Joiner (U+200D)", () => {
    const actual = parse("#ශ්‍රීලංකා");
    const expected = ["ශ්‍රීලංකා"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Arabic and Persian hashtags with numbers", () => {
    const actual = parse("#۳۴۵هشتگ #هشتگ۶۷۸ #ســـلام_عليكم_٤٠٦");
    const expected = ["۳۴۵هشتگ","هشتگ۶۷۸","ســـلام_عليكم_٤٠٦"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Hindi hashtags", () => {
    const actual = parse("#महात्मा #महात्मा_१२३४ #१२३४ गांधी");
    const expected = ["महात्मा","महात्मा_१२३४"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Indic script hashtags", () => {
    const actual = parse("#বাংলা #ગુજરાતી #ಕನ್ನಡ #മലയാളം #ଓଡ଼ିଆ #ਪੰਜਾਬੀ #සිංහල #தமிழ் #తెలుగు");
    const expected = ["বাংলা","ગુજરાતી","ಕನ್ನಡ","മലയാളം","ଓଡ଼ିଆ","ਪੰਜਾਬੀ","සිංහල","தமிழ்","తెలుగు"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Tibetan hashtags", () => {
    const actual = parse("#བོད་སྐད་ #བོད་སྐད");
    const expected = ["བོད་སྐད་","བོད་སྐད"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Khmer, Burmese, Laotian hashtags", () => {
    const actual = parse("#មហាត្មះគន្ធី #မြင့်မြတ်သော #ຊີວະສາດ");
    const expected = ["មហាត្មះគន្ធី","မြင့်မြတ်သော","ຊີວະສາດ"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Greek hashtag", () => {
    const actual = parse("#Μαχάτμα_Γκάντι ήταν Ινδός πολιτικός");
    const expected = ["Μαχάτμα_Γκάντι"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract Armenian and Georgian hashtags", () => {
    const actual = parse("#Մահաթմա #მაჰათმა");
    const expected = ["Մահաթմա","მაჰათმა"];
    expect(transform(actual)).toEqual(expected);
  });

  it("Extract hashtag with middle dot", () => {
    const actual = parse("#il·lusió");
    const expected = ["il·lusió"];
    expect(transform(actual)).toEqual(expected);
  });

  it("DO NOT extract hashtags without a letter", () => {
    const actual = parse("#_ #1_2 #122 #〃");
    const expected = [];
    expect(transform(actual)).toEqual(expected);
  });

});