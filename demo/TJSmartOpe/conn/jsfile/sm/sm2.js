function SM2Cipher(cipherMode) {
    this.ct = 1;
    this.p2 = null;
    this.sm3keybase = null;
    this.sm3c3 = null;
    this.key = new Array(32);
    this.keyOff = 0;
    if (typeof (cipherMode) != 'undefined') { this.cipherMode = cipherMode } else { this.cipherMode = SM2CipherMode.C1C3C2 }
}
SM2Cipher.prototype = { Reset: function () {
    this.sm3keybase = new SM3Digest();
    this.sm3c3 = new SM3Digest();
    var xWords = this.GetWords(this.p2.getX().toBigInteger().toRadix(16));
    var yWords = this.GetWords(this.p2.getY().toBigInteger().toRadix(16));
    this.sm3keybase.BlockUpdate(xWords, 0, xWords.length);
    this.sm3c3.BlockUpdate(xWords, 0, xWords.length);
    this.sm3keybase.BlockUpdate(yWords, 0, yWords.length);
    this.ct = 1;
    this.NextKey()
}, NextKey: function () {
    var sm3keycur = new SM3Digest(this.sm3keybase);
    sm3keycur.Update((this.ct >> 24 & 0x00ff));
    sm3keycur.Update((this.ct >> 16 & 0x00ff));
    sm3keycur.Update((this.ct >> 8 & 0x00ff));
    sm3keycur.Update((this.ct & 0x00ff));
    sm3keycur.DoFinal(this.key, 0);
    this.keyOff = 0;
    this.ct++
}, InitEncipher: function (userKey) {
    var k = null;
    var c1 = null;
    var ec = new KJUR.crypto.ECDSA({ "curve": "sm2" });
    //var keypair = ec.generateKeyPairHex();
    k = new BigInteger("2A179DFA644A6A841C228AEFEC513CCE87CA00C6755C79EE9CFC5CDAB618C118", 16);
    //k = new BigInteger(keypair.ecprvhex, 16);
    var pubkeyHex = "041FEFC0183077EE2A87403E456BB8997D5C1DAC78AAEAAE295B396CF49A629430EC5099FD21C68E177EC293F311E7AB3FE7881D8080742AEFED9792AE6E43856D";
    //var pubkeyHex = keypair.ecpubhex;
    c1 = ECPointFp.decodeFromHex(ec.ecparams['curve'], pubkeyHex);
    this.p2 = userKey.multiply(k);
        this.Reset();
    return c1
}, EncryptBlock: function (data) {
    this.sm3c3.BlockUpdate(data, 0, data.length);
    for (var i = 0; i < data.length; i++) {
        if (this.keyOff == this.key.length) { this.NextKey() }
        data[i] ^= this.key[this.keyOff++]
    }
}, InitDecipher: function (userD, c1) {
    this.p2 = c1.multiply(userD);
    this.Reset()
}, DecryptBlock: function (data) {
    for (var i = 0; i < data.length; i++) {
        if (this.keyOff == this.key.length) { this.NextKey() }
        data[i] ^= this.key[this.keyOff++]
    }
    this.sm3c3.BlockUpdate(data, 0, data.length)
}, Dofinal: function (c3) {
    var yWords = this.GetWords(this.p2.getY().toBigInteger().toRadix(16));
    this.sm3c3.BlockUpdate(yWords, 0, yWords.length);
    this.sm3c3.DoFinal(c3, 0);
    this.Reset()
}, Encrypt: function (pubKey, plaintext) {
    var data = new Array(plaintext.length);
    Array.Copy(plaintext, 0, data, 0, plaintext.length);
    var c1 = this.InitEncipher(pubKey);
    this.EncryptBlock(data);
    var c3 = new Array(32);
    this.Dofinal(c3);
    var hexString = c1.getX().toBigInteger().toRadix(16) + c1.getY().toBigInteger().toRadix(16) + this.GetHex(data).toString() + this.GetHex(c3).toString();
    if (this.cipherMode == SM2CipherMode.C1C3C2) { hexString = c1.getX().toBigInteger().toRadix(16) + c1.getY().toBigInteger().toRadix(16) + this.GetHex(c3).toString() + this.GetHex(data).toString() } return hexString
}, GetWords: function (hexStr) {
    var words = [];
    var hexStrLength = hexStr.length;
    for (var i = 0; i < hexStrLength; i += 2) { words[words.length] = parseInt(hexStr.substr(i, 2), 16) }
    return words
}, GetHex: function (arr) {
    var words = [];
    var j = 0;
    for (var i = 0; i < arr.length * 2; i += 2) {
        words[i >>> 3] |= parseInt(arr[j]) << (24 - (i % 8) * 4);
        j++
    }
    var wordArray = new CryptoJS.lib.WordArray.init(words, arr.length);
    return wordArray
}, Decrypt: function (privateKey, ciphertext) {
    var hexString = ciphertext;
    var c1X = hexString.substr(0, 64);
    var c1Y = hexString.substr(0 + c1X.length, 64);
    var encrypData = hexString.substr(c1X.length + c1Y.length, hexString.length - c1X.length - c1Y.length - 64);
    var c3 = hexString.substr(hexString.length - 64);
    if (this.cipherMode == SM2CipherMode.C1C3C2) {
        c3 = hexString.substr(c1X.length + c1Y.length, 64);
        encrypData = hexString.substr(c1X.length + c1Y.length + 64)
    } var data = this.GetWords(encrypData);
    var c1 = this.CreatePoint(c1X, c1Y);
    this.InitDecipher(privateKey, c1);
    this.DecryptBlock(data);
    var c3_ = new Array(32);
    this.Dofinal(c3_);
    var isDecrypt = this.GetHex(c3_).toString() == c3;
    if (isDecrypt) {
        var wordArray = this.GetHex(data);
        var decryptData = CryptoJS.enc.Utf8.stringify(wordArray);
        return decryptData
    } else { return '' }
}, CreatePoint: function (x, y) {
    var ec = new KJUR.crypto.ECDSA({ "curve": "sm2" });
    var ecc_curve = ec.ecparams['curve'];
    var pubkeyHex = '04' + x + y;
    var point = ECPointFp.decodeFromHex(ec.ecparams['curve'], pubkeyHex);
    return point
}
};
window.SM2CipherMode = { C1C2C3: '0', C1C3C2: '1' };
window.sm2 = {
    cipher: new SM2Cipher(0), //0 - C1C2C3 1 - C1C3C2
    userKey: null,
    decKey:new BigInteger("5C28A35DA2FE9D03A853E7A9EF01EFE4A39EFC8EAF3955B0664D90A9B4C0051F", 16),
    encrypt: function (text) {
        if (this.userKey == null) {
            var xHex = "0BB27C30A769E9DF8824A7E7CA58E87C6303E10AFDD5042131A75E0ADD1274BF";
            var yHex = "171FC67F47BBA1FA4EA5F1A84AA0434BF7AE18DA14A55A56FB3C759C883F3CC4";
            this.userKey = this.cipher.CreatePoint(xHex, yHex);
        }
        return this.cipher.Encrypt(this.userKey, this.cipher.GetWords(CryptoJS.enc.Utf8.parse(text).toString()));
    }, decrypt: function (text) {
        return this.cipher.Decrypt(this.decKey, text)
    }
}
