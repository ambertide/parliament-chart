const events = [
  ['Erdin Bircan', '2018-11-18', 'http://www.hurriyet.com.tr/gundem/son-dakika-chpli-milletvekili-erdin-bircan-hayatini-kaybetti-40966801'],
  ['Kazım Arslan', '2019-06-07', 'https://web.archive.org/web/20200718114409/https://www.sozcu.com.tr/2019/gundem/son-dakika-chp-denizli-milletvekili-kazim-arslan-hayatini-kaybetti-5063320/'],
  ['Markar Esayan', '2020-10-16', 'https://www.haberturk.com/son-dakika-ak-partili-milletvekili-markar-esayan-hayatini-kaybetti-2838151'],
  ['İsmet Uçma', '2021-10-11', 'https://web.archive.org/web/20211011140434/https://www.cnnturk.com/turkiye/son-dakika-ak-parti-milletvekili-ismet-ucma-hayatini-kaybetti'],
  ['İmran Kılıç', '2021-10-19', 'https://web.archive.org/web/20211118183909/https://www.sozcu.com.tr/2021/gundem/akp-milletvekili-imran-kilic-hayatini-kaybetti-6777028/'],
  ['Yakup Taş', '2023-02-07', 'https://www.cumhuriyet.com.tr/siyaset/son-dakika-akp-milletvekili-yakup-tas-yasamini-yitirdi-2049186'],
  ['Deniz Baykal', '2023-02-11', 'https://www.sozcu.com.tr/2023/gundem/son-dakika-deniz-baykal-hayatini-kaybetti-7588040/']
];

const jsons = events.map((([
  name,
  passedDate,
  passedSource,
]) => (
  {
    "action": "OFFICE_VACATED",
    "actor": name,
    "date": `${passedDate}T00:00:00.000Z`,
    "metadata": {
      "reason": "PASSED"
    },
    "source": passedSource,
    "target": "PARLIAMENT"
  }
)
));

console.log(JSON.stringify(jsons));
