const events = [
  ['Hayati Arkaz', '2018-08-13', 'https://web.archive.org/web/20200718114245/https://www.sozcu.com.tr/2018/gundem/hayati-arkaz-iyi-partiden-istifa-etti-2572599/', '2018-08-14', 'Milliyetçi Hareket Partisi', 'https://www.ntv.com.tr/turkiye/iyi-partiden-istifa-eden-hayati-arkaz-mhpye-katildi,WISAYTpLPkGpn4u5qEE8hA'],
  ['Tamer Akkal', '2019-01-28', 'https://www.haberturk.com/iyi-parti-manisa-milletvekili-tamer-akkal-partisinden-istifa-etti-2304640', '2019-02-05', 'Adalet ve Kalkınma Partisi', 'https://www.aa.com.tr/tr/gunun-basliklari/iyi-partiden-istifa-eden-tamer-akkal-ak-partiye-gecti/1383818'],
  ['Mustafa Yeneroğlu', '2019-10-30', 'https://tr.euronews.com/2019/10/30/akparti-milletvekili-yeneroglu-istifa-etti-partide-bircok-arkadas-benden-farkli-dusunmuyor', '2020-03-09', 'Demokrasi ve Atılım Partisi', 'https://bianet.org/haber/babacan-in-partisi-deva-nin-basvurusu-yapildi-221126'],
  ['Tuba Vural Çokal', '2020-02-13', 'https://www.sozcu.com.tr/2020/gundem/meral-aksenerden-istifa-aciklamasi-5625869/', '2020-03-11', 'Adalet ve Kalkınma Partisi', 'https://www.internethaber.com/iyi-partiden-istifa-eden-tuba-vural-cokal-ak-partiye-geciyor-2087758h.htm/'],
  ['İsmail Ok', '2020-02-17', 'https://web.archive.org/web/20200719091131/https://www.hurriyet.com.tr/gundem/son-dakika-haberler-iyi-parti-balikesir-milletvekili-ismail-ok-partideki-gorevlerinden-istifa-etti-41448956', '2022-04-20', 'Adalet ve Kalkınma Partisi', 'https://web.archive.org/web/20220420100251/https://www.haber7.com/siyaset/haber/3215130-balikesir-milletvekili-ismail-ok-ak-partiye-katildi'],
  ['Cihangir İslam', '2020-03-04', 'https://www.sozcu.com.tr/2020/gundem/milletvekili-cihangir-islam-saadet-partisinden-istifa-etti-5661080/', '2021-03-09', 'Cumhuriyet Halk Partisi', 'https://web.archive.org/web/20210309182204/https://www.sozcu.com.tr/2021/gundem/cihangir-islam-chpye-katildi-6304472/'],
  ['Ahmet Şık', '2020-05-04', 'https://www.sozcu.com.tr/2021/gundem/ahmet-sik-turkiye-isci-partisine-katildi-6382941/', '2021-04-19', 'Türkiye İşçi Partisi', 'https://www.sozcu.com.tr/2021/gundem/ahmet-sik-turkiye-isci-partisine-katildi-6382941/'],
  ['İsmail Koncuk', '2020-11-16', 'https://t24.com.tr/haber/iyi-parti-adana-milletvekili-ismail-koncuk-partisinden-istifa-etti,915110', '2021-08-26', 'Zafer Partisi', 'https://web.archive.org/web/20210826104823/https://www.haberturk.com/zafer-partisi-kuruculari-kimler-iste-zfer-partisi-kurucular-kurulu-uyeleri-tam-liste-3172362'],
  ['İsmail Koncuk', '2022-04-07', 'https://web.archive.org/web/20220407121806/https://www.cumhuriyet.com.tr/siyaset/adana-milletvekili-ismail-koncuk-zafer-partisinden-istifa-etti-bu-yonetim-anlayisi-ile-maalesef-1923521', '2022-05-25', 'İYİ Parti', 'https://www.cumhuriyet.com.tr/turkiye/ismail-koncuk-yeniden-iyi-parti-saflarina-katiliyor-1939553'],
  ['Hüseyin Avni Aksoy', '2021-01-28', 'https://www.sozcu.com.tr/2021/gundem/son-dakika-uc-milletvekili-chpden-istifa-etti-6234599/', '2021-05-17', 'Memleket Partisi', 'https://www.bbc.com/turkce/haberler-turkiye-57143930'],
  ['Özcan Özel', '2021-01-28', 'https://www.sozcu.com.tr/2021/gundem/son-dakika-uc-milletvekili-chpden-istifa-etti-6234599/', '2021-05-17', 'Memleket Partisi', 'https://www.bbc.com/turkce/haberler-turkiye-57143930'],
  ['Mehmet Ali Çelebi', '2021-01-28', 'https://www.sozcu.com.tr/2021/gundem/son-dakika-uc-milletvekili-chpden-istifa-etti-6234599/', '2021-05-17', 'Memleket Partisi', 'https://www.bbc.com/turkce/haberler-turkiye-57143930'],
  ['Mehmet Ali Çelebi', '2022-02-25', 'https://web.archive.org/web/20220225064907/https://www.birgun.net/haber/mehmet-ali-celebi-partisini-elestirerek-istifa-etti-378457', '2022-02-25', 'Adalet ve Kalkınma Partisi', 'https://web.archive.org/web/20221011084302/https://www.haberturk.com/mehmet-ali-celebi-ak-parti-ye-gecti-3528227'],
];

const jsons = events.flatMap((([
  name,
  resignDate,
  resignSource,
  switchDate,
  newParty,
  switchSource,
]) => [
  {
    "action": "PARTY_CHANGED",
    "actor": name,
    "date": `${resignDate}T00:00:00.000Z`,
    "metadata": {
      "reason": "OTHER"
    },
    "source": resignSource,
    "target": "Bağımsız"
  },
  {
    "action": "PARTY_CHANGED",
    "actor": name,
    "date": `${switchDate}T00:00:00.000Z`,
    "metadata": {
      "reason": "OTHER"
    },
    "source": switchSource,
    "target": newParty
  }
]
));

console.log(JSON.stringify(jsons));
