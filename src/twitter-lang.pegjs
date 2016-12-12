{
  const indices = ({ start, end }) => ({ indices: [start.offset, end.offset] });
  const flatten = (input) => input ? [input] : [];
}

start
  = parts:(Entity / .)*
    {
      return {
        text: text(),
        entities: parts.reduce((state, part) => ({
          hashtags: [...state.hashtags, ...flatten(part.hashtag)],
          symbols: [...state.symbols, ...flatten(part.symbol)],
          urls: [...state.urls, ...flatten(part.url)],
          user_mentions: [...state.user_mentions, ...flatten(part.mention)]
        }), {
          hashtags: [],
          symbols: [],
          urls: [],
          user_mentions: []
        })
      };
    }

/******************************************************************************/

Entity
  = url: URL
    { return { url }; }
  / symbol:Cashtag
    { return { symbol }; }
  / hashtag:Hashtag
    { return { hashtag }; }
  / mention:(List / User)
    { return { mention }; }

Cashtag
  = NonSpace cashtag:CashtagToken
    { return null; }
  / cashtag:CashtagToken CashtagToken+
    { return cashtag; }
  / cashtag:CashtagToken &(Space / Punctuation / End)
    { return cashtag; }

CashtagToken
  = "$" symbol:$([a-zA-Z]+) subsymbol:$(("." / "_") [a-zA-Z]+)?
    { return symbol.length <= 6 && { text: symbol + (subsymbol || ''), ...indices(location()) }; }

Hashtag
  = (LetterOrMark / Number) HashtagPrefix HashtagText
    { return null; }
  / HashtagPrefix Protocol? URLToken
    { return null; }
  / HashtagPrefix text:HashtagText
    { return { text, ...indices(location()) }; }

HashtagPrefix
  = "#" / "＃"

HashtagText
  = $(((Number / HashtagSpecialChar)* (LetterOrMark / AstralLetterOrMark) (Number / AstralNumber / HashtagSpecialChar)*)+)

HashtagSpecialChar
  = $("_" / "\u200c" / "\u200d" / "\ua67e" / "\u05be" / "\u05f3" / "\u05f4" / "\uff5e" / "\u301c" / "\u309b" / "\u309c" / "\u30a0" / "\u30fb" / "\u3003" / "\u0f0b" / "\u0f0c" / "\u00b7")

User
  = UserToken UserToken+
    { return null; }
  / UserToken UserTokenInvalidSuffix
    { return null; }
  / [rt]i ":"? user:UserToken
    { return user; }
  / UserTokenInvalidPrefix UserToken
    { return null; }
  / UserToken

UserToken
  = UserPrefix screen_name:$(UserNameChar+)
    { return screen_name.length <= 20 && { screen_name, ...indices(location()) }; }

UserPrefix
  = "@" / "＠"

UserNameChar
  = [a-z0-9_]i

UserTokenInvalidPrefix
  = UserNameChar / UserPrefix / HashtagPrefix / "!" / "$" / "%" / "&" / "*"

UserTokenInvalidSuffix
  = UserPrefix / LatinAccent / "://"

List
  = user:User list_slug:ListSlug
    { return { screen_name: user.screen_name, list_slug, ...indices(location()) }; }

ListSlug
  = $("/" (Letter (Number / "_" / "-")*)+)

URL
  = $(URLInvalidPrefix Protocol? URLToken)
    { return null; }
  / tco:$("http" "s"? "://t.co/" [a-z0-9]i+)
    { return { url: tco, ...indices(location()) }; }
  / $(SubDomain* DomainChar+ "." CCTLD) &(Space / End)
    { return null;}
  / url:$(URLToken)
    { return { url, ...indices(location()) }; }
  / url:$(Protocol URLToken)
    { return { url, ...indices(location()) }; }

URLToken
  = $(SubDomain* Domain Port? Path* Querystring?)

URLInvalidPrefix
  = "$"

Protocol
  = "http" "s"? "://"

Domain
  = DomainChar+ "." TLD &(Port / Path / Space / End)

DomainChar
  = $((AlphaNumeric / LatinAccent) ("-"? (AlphaNumeric / LatinAccent))+)
  / AlphaNumeric
  / LatinAccent

SubDomain
  = SubDomainChar+ "." &Domain

SubDomainChar
  = $(DomainChar "_"? DomainChar)
  / DomainChar

TLD
  = [abb|abbott|abogado|academy|accenture|accountant|accountants|aco|active|actor|ads|adult|aeg|aero|afl|agency|aig|airforce|airtel|allfinanz|alsace|amsterdam|android|apartments|app|aquarelle|archi|army|arpa|asia|associates|attorney|auction|audio|auto|autos|axa|azure|band|bank|bar|barcelona|barclaycard|barclays|bargains|bauhaus|bayern|bbc|bbva|bcn|beer|bentley|berlin|best|bet|bharti|bible|bid|bike|bing|bingo|bio|biz|black|blackfriday|bloomberg|blue|bmw|bnl|bnpparibas|boats|bond|boo|boots|boutique|bradesco|bridgestone|broker|brother|brussels|budapest|build|builders|business|buzz|bzh|cab|cafe|cal|camera|camp|cancerresearch|canon|capetown|capital|caravan|cards|care|career|careers|cars|cartier|casa|cash|casino|cat|catering|cba|cbn|ceb|center|ceo|cern|cfa|cfd|chanel|channel|chat|cheap|chloe|christmas|chrome|church|cisco|citic|city|claims|cleaning|click|clinic|clothing|cloud|club|coach|codes|coffee|college|cologne|com|commbank|community|company|computer|condos|construction|consulting|contractors|cooking|cool|coop|corsica|country|coupons|courses|credit|creditcard|cricket|crown|crs|cruises|cuisinella|cymru|cyou|dabur|dad|dance|date|dating|datsun|day|dclk|deals|degree|delivery|delta|democrat|dental|dentist|desi|design|dev|diamonds|diet|digital|direct|directory|discount|dnp|docs|dog|doha|domains|doosan|download|drive|durban|dvag|earth|eat|edu|education|email|emerck|energy|engineer|engineering|enterprises|epson|equipment|erni|esq|estate|eurovision|eus|events|everbank|exchange|expert|exposed|express|fage|fail|faith|family|fan|fans|farm|fashion|feedback|film|finance|financial|firmdale|fish|fishing|fit|fitness|flights|florist|flowers|flsmidth|fly|foo|football|forex|forsale|forum|foundation|frl|frogans|fund|furniture|futbol|fyi|gal|gallery|game|garden|gbiz|gdn|gent|genting|ggee|gift|gifts|gives|giving|glass|gle|global|globo|gmail|gmo|gmx|gold|goldpoint|golf|goo|goog|google|gop|gov|graphics|gratis|green|gripe|group|guge|guide|guitars|guru|hamburg|hangout|haus|healthcare|help|here|hermes|hiphop|hitachi|hiv|hockey|holdings|holiday|homedepot|homes|honda|horse|host|hosting|hoteles|hotmail|house|how|hsbc|ibm|icbc|ice|icu|ifm|iinet|immo|immobilien|industries|infiniti|info|ing|ink|institute|insure|int|international|investments|ipiranga|irish|ist|istanbul|itau|iwc|java|jcb|jetzt|jewelry|jlc|jll|jobs|joburg|jprs|juegos|kaufen|kddi|kim|kitchen|kiwi|koeln|komatsu|krd|kred|kyoto|lacaixa|lancaster|land|lasalle|lat|latrobe|law|lawyer|lds|lease|leclerc|legal|lexus|lgbt|liaison|lidl|life|lighting|limited|limo|link|live|lixil|loan|loans|lol|london|lotte|lotto|love|ltda|lupin|luxe|luxury|madrid|maif|maison|man|management|mango|market|marketing|markets|marriott|mba|media|meet|melbourne|meme|memorial|men|menu|miami|microsoft|mil|mini|mma|mobi|moda|moe|mom|monash|money|montblanc|mormon|mortgage|moscow|motorcycles|mov|movie|movistar|mtn|mtpc|museum|nadex|nagoya|name|navy|nec|net|netbank|network|neustar|new|news|nexus|ngo|nhk|nico|ninja|nissan|nokia|nra|nrw|ntt|nyc|office|okinawa|omega|one|ong|onl|online|ooo|oracle|orange|org|organic|osaka|otsuka|ovh|page|panerai|paris|partners|parts|party|pet|pharmacy|philips|photo|photography|photos|physio|piaget|pics|pictet|pictures|pink|pizza|place|play|plumbing|plus|pohl|poker|porn|post|praxi|press|pro|prod|productions|prof|properties|property|pub|qpon|quebec|racing|realtor|realty|recipes|red|redstone|rehab|reise|reisen|reit|ren|rent|rentals|repair|report|republican|rest|restaurant|review|reviews|rich|ricoh|rio|rip|rocks|rodeo|rsvp|ruhr|run|ryukyu|saarland|sakura|sale|samsung|sandvik|sandvikcoromant|sanofi|sap|sarl|saxo|sca|scb|schmidt|scholarships|school|schule|schwarz|science|scor|scot|seat|seek|sener|services|sew|sex|sexy|shiksha|shoes|show|shriram|singles|site|ski|sky|skype|sncf|soccer|social|software|sohu|solar|solutions|sony|soy|space|spiegel|spreadbetting|srl|starhub|statoil|studio|study|style|sucks|supplies|supply|support|surf|surgery|suzuki|swatch|swiss|sydney|systems|taipei|tatamotors|tatar|tattoo|tax|taxi|team|tech|technology|tel|telefonica|temasek|tennis|thd|theater|tickets|tienda|tips|tires|tirol|today|tokyo|tools|top|toray|toshiba|tours|town|toyota|toys|trade|trading|training|travel|trust|tui|ubs|university|uno|uol|vacations|vegas|ventures|vermögensberater|vermögensberatung|versicherung|vet|viajes|video|villas|vin|vision|vista|vistaprint|vlaanderen|vodka|vote|voting|voto|voyage|wales|walter|wang|watch|webcam|website|wed|wedding|weir|whoswho|wien|wiki|williamhill|win|windows|wine|wme|work|works|world|wtc|wtf|xbox|xerox|xin|xperia|xxx|xyz|yachts|yandex|yodobashi|yoga|yokohama|youtube|zip|zone|zuerich|дети|ком|москва|онлайн|орг|рус|сайт|קום|بازار|شبكة|كوم|موقع|कॉम|नेट|संगठन|คอม|みんな|グーグル|コム|世界|中信|中文网|企业|佛山|信息|健康|八卦|公司|公益|商城|商店|商标|在线|大拿|娱乐|工行|广东|慈善|我爱你|手机|政务|政府|新闻|时尚|机构|淡马锡|游戏|点看|移动|组织机构|网址|网店|网络|谷歌|集团|飞利浦|餐厅|닷넷|닷컴|삼성|onion]+
  / CCTLD
  / CCTLDSpecialCased
  / "xn--" [0-9a-z]i+

CCTLD
  = [ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bl|bm|bn|bo|bq|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tp|tr|tt|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw|ελ|бел|мкд|мон|рф|срб|укр|қаз|հայ|الاردن|الجزائر|السعودية|المغرب|امارات|ایران|بھارت|تونس|سودان|سورية|عراق|عمان|فلسطين|قطر|مصر|مليسيا|پاکستان|भारत|বাংলা|ভারত|ਭਾਰਤ|ભારત|இந்தியா|இலங்கை|சிங்கப்பூர்|భారత్|ලංකා|ไทย|გე|中国|中國|台湾|台灣|新加坡|澳門|香港|한국]+

CCTLDSpecialCased
  = [co|tv]+

Port
  = ":" [1-9] [0-9]*

Path
  = "/" URLPathChar*

Querystring
  = "?" URLQuerystringChar*

/*******************************************************************************
 * Common
 ******************************************************************************/

Space
  = "\u0020"        // White_Space # Zs       SPACE
  / "\u0085"        // White_Space # Cc       <control-0085>
  / "\u00A0"        // White_Space # Zs       NO-BREAK SPACE
  / "\u1680"        // White_Space # Zs       OGHAM SPACE MARK
  / "\u180E"        // White_Space # Zs       MONGOLIAN VOWEL SEPARATOR
  / "\u2028"        // White_Space # Zl       LINE SEPARATOR
  / "\u2029"        // White_Space # Zp       PARAGRAPH SEPARATOR
  / "\u202F"        // White_Space # Zs       NARROW NO-BREAK SPACE
  / "\u205F"        // White_Space # Zs       MEDIUM MATHEMATICAL SPACE
  / "\u3000"        // White_Space # Zs       IDEOGRAPHIC SPACE
  / [\u0009-\u000D] // White_Space # Cc   [5] <control-0009>..<control-000D>
  / [\u2000-\u200A] // White_Space # Zs  [11] EN QUAD..HAIR SPACE

NonSpace
  = $([^\u0020\u0085\u00A0\y1680\u180E\u2028\u2029\u202F\u205F\u3000])
  / "[^\u2000-\u200A]"
  / "[^\u2000-\u200A]"

Punctuation
  = "!" / "'" / "#" / "%" / "&" / "'" / "(" / ")" / "*" / "+" / "," / "\\" / "-"
  / "." / "/" / ":" / ";" / "<" / "=" / ">" / "?" / "@" / "[" / "]" / "^" / "_"
  / "{" / "|" / "}" / "~" / "$"

End
  = !.

AlphaNumeric
  = Letter
  / Number

Number
  = $("0" / "1" / "2" / "3" / "4" / "5" / "6" / "7" / "8" / "9" / [\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])

AstralNumber
  = "\ud801" [\udca0-\udca9]
  / "\ud804" [\udc66-\udc6f\udcf0-\udcf9\udd36-\udd3f\uddd0-\uddd9\udef0-\udef9]
  / "\ud805" [\udcd0-\udcd9\ude50-\ude59\udec0-\udec9]
  / "\ud806" [\udce0-\udce9]
  / "\ud81a" [\ude60-\ude69\udf50-\udf59]
  / "\ud835" [\udfce-\udfff]

Letter
  = $([a-z]i)

LetterOrMark
  = $(Letter / [\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2D])

AstralLetterOrMark
  = "\ud800" [\udc00-\udc0b\udc0d-\udc26\udc28-\udc3a\udc3c\udc3d\udc3f-\udc4d\udc50-\udc5d\udc80-\udcfa\uddfd\ude80-\ude9c\udea0-\uded0\udee0\udf00-\udf1f\udf30-\udf40\udf42-\udf49\udf50-\udf7a\udf80-\udf9d\udfa0-\udfc3\udfc8-\udfcf]
  / "\ud801" [\udc00-\udc9d\udd00-\udd27\udd30-\udd63\ude00-\udf36\udf40-\udf55\udf60-\udf67]
  / "\ud802" [\udc00-\udc05\udc08\udc0a-\udc35\udc37\udc38\udc3c\udc3f-\udc55\udc60-\udc76\udc80-\udc9e\udd00-\udd15\udd20-\udd39\udd80-\uddb7\uddbe\uddbf\ude00-\ude03\ude05\ude06\ude0c-\ude13\ude15-\ude17\ude19-\ude33\ude38-\ude3a\ude3f\ude60-\ude7c\ude80-\ude9c\udec0-\udec7\udec9-\udee6\udf00-\udf35\udf40-\udf55\udf60-\udf72\udf80-\udf91]
  / "\ud803" [\udc00-\udc48]
  / "\ud804" [\udc00-\udc46\udc7f-\udcba\udcd0-\udce8\udd00-\udd34\udd50-\udd73\udd76\udd80-\uddc4\uddda\ude00-\ude11\ude13-\ude37\udeb0-\udeea\udf01-\udf03\udf05-\udf0c\udf0f\udf10\udf13-\udf28\udf2a-\udf30\udf32\udf33\udf35-\udf39\udf3c-\udf44\udf47\udf48\udf4b-\udf4d\udf57\udf5d-\udf63\udf66-\udf6c\udf70-\udf74]
  / "\ud805" [\udc80-\udcc5\udcc7\udd80-\uddb5\uddb8-\uddc0\ude00-\ude40\ude44\ude80-\udeb7]
  / "\ud806" [\udca0-\udcdf\udcff\udec0-\udef8]
  / "\ud808" [\udc00-\udf98]
  / "\ud80c" [\udc00-\udfff]
  / "\ud80d" [\udc00-\udc2e]
  / "\ud81a" [\udc00-\ude38\ude40-\ude5e\uded0-\udeed\udef0-\udef4\udf00-\udf36\udf40-\udf43\udf63-\udf77\udf7d-\udf8f]
  / "\ud81b" [\udf00-\udf44\udf50-\udf7e\udf8f-\udf9f]
  / "\ud82c" [\udc00\udc01]
  / "\ud82f" [\udc00-\udc6a\udc70-\udc7c\udc80-\udc88\udc90-\udc99\udc9d\udc9e]
  / "\ud834" [\udd65-\udd69\udd6d-\udd72\udd7b-\udd82\udd85-\udd8b\uddaa-\uddad\ude42-\ude44]
  / "\ud835" [\udc00-\udc54\udc56-\udc9c\udc9e\udc9f\udca2\udca5\udca6\udca9-\udcac\udcae-\udcb9\udcbb\udcbd-\udcc3\udcc5-\udd05\udd07-\udd0a\udd0d-\udd14\udd16-\udd1c\udd1e-\udd39\udd3b-\udd3e\udd40-\udd44\udd46\udd4a-\udd50\udd52-\udea5\udea8-\udec0\udec2-\udeda\udedc-\udefa\udefc-\udf14\udf16-\udf34\udf36-\udf4e\udf50-\udf6e\udf70-\udf88\udf8a-\udfa8\udfaa-\udfc2\udfc4-\udfcb]
  / "\ud83a" [\udc00-\udcc4\udcd0-\udcd6]
  / "\ud83b" [\ude00-\ude03\ude05-\ude1f\ude21\ude22\ude24\ude27\ude29-\ude32\ude34-\ude37\ude39\ude3b\ude42\ude47\ude49\ude4b\ude4d-\ude4f\ude51\ude52\ude54\ude57\ude59\ude5b\ude5d\ude5f\ude61\ude62\ude64\ude67-\ude6a\ude6c-\ude72\ude74-\ude77\ude79-\ude7c\ude7e\ude80-\ude89\ude8b-\ude9b\udea1-\udea3\udea5-\udea9\udeab-\udebb]
  / "\ud840" [\udc00-\udfff]
  / "\ud841" [\udc00-\udfff]
  / "\ud842" [\udc00-\udfff]
  / "\ud843" [\udc00-\udfff]
  / "\ud844" [\udc00-\udfff]
  / "\ud845" [\udc00-\udfff]
  / "\ud846" [\udc00-\udfff]
  / "\ud847" [\udc00-\udfff]
  / "\ud848" [\udc00-\udfff]
  / "\ud849" [\udc00-\udfff]
  / "\ud84a" [\udc00-\udfff]
  / "\ud84b" [\udc00-\udfff]
  / "\ud84c" [\udc00-\udfff]
  / "\ud84d" [\udc00-\udfff]
  / "\ud84e" [\udc00-\udfff]
  / "\ud84f" [\udc00-\udfff]
  / "\ud850" [\udc00-\udfff]
  / "\ud851" [\udc00-\udfff]
  / "\ud852" [\udc00-\udfff]
  / "\ud853" [\udc00-\udfff]
  / "\ud854" [\udc00-\udfff]
  / "\ud855" [\udc00-\udfff]
  / "\ud856" [\udc00-\udfff]
  / "\ud857" [\udc00-\udfff]
  / "\ud858" [\udc00-\udfff]
  / "\ud859" [\udc00-\udfff]
  / "\ud85a" [\udc00-\udfff]
  / "\ud85b" [\udc00-\udfff]
  / "\ud85c" [\udc00-\udfff]
  / "\ud85d" [\udc00-\udfff]
  / "\ud85e" [\udc00-\udfff]
  / "\ud85f" [\udc00-\udfff]
  / "\ud860" [\udc00-\udfff]
  / "\ud861" [\udc00-\udfff]
  / "\ud862" [\udc00-\udfff]
  / "\ud863" [\udc00-\udfff]
  / "\ud864" [\udc00-\udfff]
  / "\ud865" [\udc00-\udfff]
  / "\ud866" [\udc00-\udfff]
  / "\ud867" [\udc00-\udfff]
  / "\ud868" [\udc00-\udfff]
  / "\ud869" [\udc00-\uded6\udf00-\udfff]
  / "\ud86a" [\udc00-\udfff]
  / "\ud86b" [\udc00-\udfff]
  / "\ud86c" [\udc00-\udfff]
  / "\ud86d" [\udc00-\udf34\udf40-\udfff]
  / "\ud86e" [\udc00-\udc1d]
  / "\ud87e" [\udc00-\ude1d]
  / "\udb40" [\udd00-\uddef]

LatinAccent
  = [\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u00ff\u0100-\u024f\u0253-\u0254\u0256-\u0257\u0259-\u0259\u025b-\u025b\u0263-\u0263\u0268-\u0268\u026f-\u026f\u0272-\u0272\u0289-\u0289\u028b-\u028b\u02bb-\u02bb\u0300-\u036f\u1e00-\u1eff]

URLPathChar
  = [a-z0-9]i
  / ("!" / "*" / "'" / ";" / ":" / "=" / "+" / "," / "." / "$" / "%" / "[" / "]" / "-" / "_" / "~" / "@" / "|" / "&") &(URLPathChar)
  / "/" / "#" / "(" / ")"
  / LetterOrMark / LatinAccent

URLQuerystringChar
  = [a-z0-9]i
  / "!" / "?" / "*" / "'" / "@" / "(" / ")" / ";" / ":" / "&" / "=" / "+" / "$" / "/" / "%" / "#" / "[" / "]" / "-" / "_" / "." / "," / "~" / "|"
