
// emoticon replacement dictionary
var emoticon_list = {
    ':)' : '｡◕‿◕｡',
    '(:' : '(▰˘◡˘▰)',
    ':p' : '（〜^∇^)〜',
    ';p' : '(-‿◦☀)',
    ';)' : '(。^_-)ノ',
    ':D' : 'o(〃＾▽＾〃)o',
    ';D' : '(●´∀｀●)',
    '._.' : '(^._.^)ﾉ',
    '.__.' : '｡◕‿‿◕｡',
    '._.;' : '(,,◕　⋏　◕,,)',
    '._.\'' : '(,,◕　⋏　◕,,)',
    '._.!' : '(づ｡◕‿‿◕｡)づ',
    ':o' : '(゜。゜)',
    ':O' : '(´⊙ω⊙`)！',
    'o_o' : '＼(○o○)ノ',
    '><' : 'ヽ(≧Д≦)ノ',
    '>_<' : '（＞д＜）',
    '>.<' : '(*￣m￣)',
    ':B' : '(●￣(ｴ)￣●)',
    '^o^' : '(ノ^o^)ノ',
    '<_<' : 'ヘ(￣ω￣ヘ)',
    '<.<' : '〜(￣△￣〜)',
    '>_>' : '(ﾉ≧∀≦)ﾉ',
    '>.>' : '(ﾉ◕ヮ◕)ﾉ*:・ﾟ✧',
    ':x' : '(✖╭╮✖)',
    'x)' : '✖‿✖',
    'x_x' : '(=ｘェｘ=)',
    'u_u' : 'U￣ｰ￣U',
    '\\o/' : '＼（＠￣∇￣＠）／',
    '^^!' : '☆*･゜ﾟ･*\\(^O^)/*･゜ﾟ･*☆',
    ':/' : '（ー△ー；）',
    ':\\' : '(一。一;;）',
    'u_u' : '(▰︶︹︺▰)',
    'u3u' : '(︶ω︶)',
    '>3<' : 'о(ж＞▽＜)ｙ ☆',
    'n_n' : '(✿◠‿◠)',
    'n_n\'' : 'ヾ（*⌒ヮ⌒*）ゞ',
    ':n' : '(っ˘̩╭╮˘̩)っ',
    'n_N' : '｢(＝＞o≦＝)ﾉ',
    '<3' : '(≚ᄌ≚)ℒℴѵℯ❤',
    'E>' : '(｡♥‿♥｡)',
    ':v' : '（＾ｖ＾）',
    'XD' : '(ノ＞▽＜。)ノ',
    'xD' : 'o(≧∇≦o)',
    'xP' : 'p(≧∇≦)q',
    '^^' : '(。⌒∇⌒)。',
    '^_^' : '(=^-ω-^=)',
    '^.^' : '｡^‿^｡',
    '^-^' : '（‐＾▽＾‐）',
    ';_;' : '.・゜゜・（／。＼）・゜゜・．',
    ';.;' : '｡：ﾟ(｡ﾉω＼｡)ﾟ･｡',
    ';__;' : '(இ﹏இ`｡)',
    '; ;' : '｡ﾟ( ﾟஇ‸இﾟ)ﾟ｡',
    'T_T' : 'o(╥﹏╥)o',
    'T__T' : '(━┳━ _ ━┳━)',
    'T.T' : '(。┰ω┰。)',
    'T-T' : '｡：ﾟ(｡ﾉω＼｡)ﾟ･｡',
    ':3' : '｡＾⋏＾｡',
    ':(' : '(▰˘︹˘▰)',
    ';(' : '(っ˘̩╭╮˘̩)っ',
    'o/' : 'ヾ(＠⌒ー⌒＠)ノ',
    'z_z' : '(∪｡∪)｡｡｡zzz',
    'z.z' : '(≚ᄌ≚)ƶƵ'
}

// replaces any basic emoticons in the given string with more interesting ones
function emoticons_replace(line) {
    var re = /(?:^|\s)(\S(?:_*|\s)\S{1,2})(?=\s|$)/g; // match potential emoticons
    var result = line;
    var m;
    while ((m = re.exec(line)) != null) {
        if (emoticon_list[m[1]]) {
            // matched emoticon should be replaced
            result = result.replace(m[1], emoticon_list[m[1]]);
        }
        else {
            // check if unextended version of matched
            // emoticon should be replaced
            if (m[1][1] == '_' && m[1][m[1].length-1] != '_' &&
                m[1][m[1].length-2] == '_') {
                // check for most extended valid emoticons
                if (emoticon_list[m[1][0] + '__' + m[1][m[1].length-1]]) {
                    result = result.replace(m[1], emoticon_list[m[1][0] +
                        '__' + m[1][m[1].length-1]] +
                            (Array(m[1].length - 3).join("〜")));
                }
                // check for least extended valid emoticons
                else if (emoticon_list[m[1][0] + '_' + m[1][m[1].length-1]]) {
                    result = result.replace(m[1], emoticon_list[m[1][0] +
                        '_' + m[1][m[1].length-1]] +
                            (Array(m[1].length - 3).join("〜")));
                }
            }
            // normal text
        }
    }
    return result;
}
