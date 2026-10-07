export type QuestionType = 'eslestirme' | 'dogru-yanlis' | 'bosluk-doldurma' | 'kasa-montaji' | 'coktan-secmeli';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  category: 'ic' | 'dis' | 'genel';
  conceptKey: string;
  hint: string;
  explanation: string;
}

export interface MatchingCard {
  id: string;
  text: string;
  category: 'ic' | 'dis' | 'giris' | 'cikis';
  categoryLabel: string;
  iconName: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'eslestirme';
  instruction: string;
  cards: MatchingCard[];
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'dogru-yanlis';
  statement: string;
  isTrue: boolean;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'bosluk-doldurma';
  sentenceBefore: string;
  sentenceAfter: string;
  options: string[];
  correctAnswer: string;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'coktan-secmeli';
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

export interface AssemblySlot {
  id: string;
  slotName: string;
  requiredPartId: string;
  requiredPartName: string;
  description: string;
  hint: string;
  orderNumber: number;
}

export interface AssemblyQuestion extends BaseQuestion {
  type: 'kasa-montaji';
  instruction: string;
  slots: AssemblySlot[];
  availableParts: {
    id: string;
    name: string;
    iconName: string;
    shortInfo: string;
  }[];
}

export type QuizQuestion = 
  | MatchingQuestion 
  | TrueFalseQuestion 
  | FillBlankQuestion 
  | MultipleChoiceQuestion 
  | AssemblyQuestion;

export const OYUN_SORULARI: QuizQuestion[] = [
  // 1. Kasa Montajı (Sanal PC Montajı)
  {
    id: 'montaj-1',
    type: 'kasa-montaji',
    title: 'Bilgisayar Kasa Montaj Laboratuvarı',
    category: 'ic',
    conceptKey: 'Kasa İçi Montaj Sırası ve Yuvalar',
    hint: 'Anakart üzerindeki kare şeklindeki soket işlemci içindir, uzun mandallı yuvalar ise RAM bellekler içindir.',
    explanation: 'Doğru montaj sırası: Önce CPU sokete yerleştirilir, ardından soğutucu monte edilir, RAM ler çift kanal yuvalarına takılır, M.2 SSD takılır, güç kaynağı kasanın alt bölmesine yerleştirilir ve en son PCIe yuvasına ekran kartı oturtulur.',
    instruction: 'Parça tepsisindeki donanımları inceleyerek anakart ve kasa üzerindeki doğru montaj yuvalarına yerleştirin.',
    slots: [
      {
        id: 'slot-cpu',
        slotName: 'İşlemci Soketi (LGA / AM5)',
        requiredPartId: 'part-cpu',
        requiredPartName: 'İşlemci (CPU)',
        description: 'Anakartın kalbinde yer alan, binlerce altın pin veya temas noktası içeren kare soket.',
        hint: 'Bu sokete tüm hesaplamaları yapan bilgisayarın beyni takılmalıdır.',
        orderNumber: 1
      },
      {
        id: 'slot-ram',
        slotName: 'DIMM Bellek Yuvaları',
        requiredPartId: 'part-ram',
        requiredPartName: 'RAM Modülleri',
        description: 'İşlemci soketinin hemen sağında bulunan, çift mandallı dikey bellek slotları.',
        hint: 'Açık olan programların geçici verilerinin saklandığı yüksek hızlı bellekleri buraya takın.',
        orderNumber: 2
      },
      {
        id: 'slot-cooler',
        slotName: 'İşlemci Soğutucu Bloğu & Fanı',
        requiredPartId: 'part-cooler',
        requiredPartName: 'Soğutma Fanı',
        description: 'İşlemcinin üzerine termal macun sürülerek vidalanan alüminyum/bakır ızgaralı soğutucu.',
        hint: 'İşlemcinin 100 dereceye ulaşıp yanmasını önleyen soğutma ünitesini yerleştirin.',
        orderNumber: 3
      },
      {
        id: 'slot-ssd',
        slotName: 'M.2 NVMe SSD Yuvası',
        requiredPartId: 'part-ssd',
        requiredPartName: 'M.2 NVMe SSD',
        description: 'Anakart üzerinde doğrudan PCIe hatlarına bağlanan küçük vidalı kompakt depolama yuvası.',
        hint: 'Saniyede binlerce megabayt veri okuyan kalıcı katı hal depolama birimini buraya vidalayın.',
        orderNumber: 4
      },
      {
        id: 'slot-gpu',
        slotName: 'PCIe x16 Genişleme Yuvası',
        requiredPartId: 'part-gpu',
        requiredPartName: 'Ekran Kartı (GPU)',
        description: 'Anakartın alt yarısında yer alan, en yüksek bant genişliğine sahip uzun mandallı yuva.',
        hint: 'Monitöre yüksek çözünürlüklü 3D görüntü aktaracak grafik kartını buraya yerleştirin.',
        orderNumber: 5
      },
      {
        id: 'slot-psu',
        slotName: 'Kasa Alt Güç Kaynağı Bölmesi',
        requiredPartId: 'part-psu',
        requiredPartName: 'Güç Kaynağı (PSU)',
        description: 'Kasanın tabanında yer alan, 220V elektrik kablosunun girdiği havalandırmalı güç tüneli.',
        hint: 'Prizden gelen elektriği 12V ve 5V doğru akıma çeviren güç ünitesini yerleştirin.',
        orderNumber: 6
      }
    ],
    availableParts: [
      { id: 'part-cpu', name: 'İşlemci (CPU)', iconName: 'Cpu', shortInfo: 'Merkezi işlem birimi (Hesaplama)' },
      { id: 'part-cooler', name: 'Soğutma Fanı', iconName: 'Fan', shortInfo: 'Isı tahliye sistemi' },
      { id: 'part-ram', name: 'RAM Bellek (DDR5)', iconName: 'Server', shortInfo: 'Geçici hızlı çalışma alanı' },
      { id: 'part-ssd', name: 'M.2 NVMe SSD', iconName: 'HardDrive', shortInfo: 'Kalıcı hızlı depolama' },
      { id: 'part-gpu', name: 'Ekran Kartı (GPU)', iconName: 'Tv', shortInfo: 'Görsel işleme birimi' },
      { id: 'part-psu', name: 'Güç Kaynağı (PSU)', iconName: 'Zap', shortInfo: 'Elektrik dağıtım ünitesi' }
    ]
  },

  // 2. Eşleştirme (İç vs Dış Donanım)
  {
    id: 'eslestirme-1',
    type: 'eslestirme',
    title: 'Donanım Sınıflandırma: İç ve Dış Birimleri Eşleştir',
    category: 'genel',
    conceptKey: 'İç ve Dış Donanım Ayrımı',
    hint: 'Kasanın içinde anakarta doğrudan bağlı olanlar İç Donanım; kablo veya kablosuz olarak kasaya dışarıdan bağlananlar Dış Donanımdır.',
    explanation: 'İşlemci, RAM, Anakart ve Güç Kaynağı kasanın içinde korunan İç Donanımlardır. Monitör, Klavye, Fare ve Yazıcı ise kullanıcı ile etkileşimi sağlayan Dış Donanımlardır.',
    instruction: 'Her bir donanım kartını ait olduğu doğru kategoriye (İç Donanım veya Dış Donanım) tıklayarak sınıflandırın.',
    cards: [
      { id: 'c-cpu', text: 'Merkezi İşlemci (CPU)', category: 'ic', categoryLabel: 'İç Donanım', iconName: 'Cpu' },
      { id: 'c-mon', text: 'Monitör (Ekran)', category: 'dis', categoryLabel: 'Dış Donanım', iconName: 'Monitor' },
      { id: 'c-ram', text: 'RAM Bellek', category: 'ic', categoryLabel: 'İç Donanım', iconName: 'Server' },
      { id: 'c-key', text: 'Klavye', category: 'dis', categoryLabel: 'Dış Donanım', iconName: 'Keyboard' },
      { id: 'c-psu', text: 'Güç Kaynağı (PSU)', category: 'ic', categoryLabel: 'İç Donanım', iconName: 'Zap' },
      { id: 'c-mou', text: 'Optik Fare (Mouse)', category: 'dis', categoryLabel: 'Dış Donanım', iconName: 'Mouse' }
    ]
  },

  // 3. Çoktan Seçmeli Soru 1
  {
    id: 'mc-1',
    type: 'coktan-secmeli',
    title: 'Bilgisayarın Beyni',
    category: 'ic',
    conceptKey: 'İşlemci (CPU) Görevi',
    hint: 'Saniyede milyarlarca matematiksel ve mantıksal hesaplama yapan, saat frekansı GHz ile ölçülen parçayı düşünün.',
    explanation: 'CPU (Merkezi İşlem Birimi), bilgisayardaki tüm komutları yorumlayan ve hesaplamaları yürüten ana organdır. Bu nedenle bilgisayarın beyni kabul edilir.',
    question: 'Bilgisayarda tüm aritmetik ve mantıksal işlemleri gerçekleştiren, diğer donanımlara komut veren ve "bilgisayarın beyni" olarak tanımlanan iç donanım birimi hangisidir?',
    options: [
      { id: 'opt-a', text: 'Sabit Disk (HDD/SSD)' },
      { id: 'opt-b', text: 'Merkezi İşlem Birimi (İşlemci / CPU)' },
      { id: 'opt-c', text: 'Güç Kaynağı (PSU)' },
      { id: 'opt-d', text: 'Ekran Kartı (GPU)' }
    ],
    correctOptionId: 'opt-b'
  },

  // 4. Doğru / Yanlış 1
  {
    id: 'tf-1',
    type: 'dogru-yanlis',
    title: 'Bellek Özellikleri Testi',
    category: 'ic',
    conceptKey: 'RAM Belleğin Uçuculuğu (Volatile)',
    hint: 'Elektrik prizden çekildiğinde veya bilgisayar yeniden başlatıldığında açık olan dosyalara ne olduğuna dikkat edin.',
    explanation: 'RAM geçici (uçucu) bir bellektir. Bilgisayar kapatıldığında içindeki veriler tamamen silinir. Kalıcı veriler ise SSD veya HDD üzerinde saklanır.',
    statement: 'RAM (Rastgele Erişimli Bellek), bilgisayar kapatıldığında veya elektrik kesildiğinde üzerindeki tüm verileri kalıcı olarak saklamaya devam eder.',
    isTrue: false
  },

  // 5. Boşluk Doldurma 1
  {
    id: 'fill-1',
    type: 'bosluk-doldurma',
    title: 'Enerji ve Dönüşüm',
    category: 'ic',
    conceptKey: 'Güç Kaynağı (PSU) Fonksiyonu',
    hint: 'Prizdeki 220V alternatif akımı (AC) parçaların ihtiyaç duyduğu 12V, 5V, 3.3V doğru akıma (DC) dönüştüren kutudur.',
    explanation: 'Güç Kaynağı (PSU), şehir şebekesinden gelen yüksek voltajlı alternatif akımı bilgisayar parçalarının hassas devrelerine uygun doğru akım voltajlarına çevirir.',
    sentenceBefore: 'Şehir şebekesinden gelen 220 Volt alternatif akımı (AC), bilgisayarın hassas devrelerinin kullanabileceği düşük voltajlı doğru akıma (DC) dönüştüren iç donanım birimi',
    sentenceAfter: 'olarak adlandırılır.',
    options: ['Güç Kaynağı (PSU)', 'Ses Kartı', 'Anakart', 'Monitör'],
    correctAnswer: 'Güç Kaynağı (PSU)'
  },

  // 6. Eşleştirme 2 (Giriş vs Çıkış vs G/Ç Birimleri)
  {
    id: 'eslestirme-2',
    type: 'eslestirme',
    title: 'Veri Yönü: Giriş, Çıkış ve Hem Giriş-Çıkış Birimleri',
    category: 'dis',
    conceptKey: 'Dış Donanımda Veri Akış Yönü (Input / Output / IO)',
    hint: 'Kullanıcıdan bilgisayara veri gönderenler Giriş; bilgisayardan kullanıcıya sonuç sunanlar Çıkış; her iki yönlü çalışanlar ise Giriş/Çıkış birimidir.',
    explanation: 'Tarayıcı ve Mikrofon veriyi bilgisayara aktardığı için Giriş; Monitör ve Hoparlör dış dünyaya aktardığı için Çıkış birimidir.',
    instruction: 'Aşağıdaki çevre birimlerini veri akış yönüne göre doğru kategoriye yerleştirin.',
    cards: [
      { id: 'c-tar', text: 'Tarayıcı (Scanner)', category: 'giris', categoryLabel: 'Giriş Birimi (Input)', iconName: 'ScanLine' },
      { id: 'c-hop', text: 'Hoparlör & Kulaklık', category: 'cikis', categoryLabel: 'Çıkış Birimi (Output)', iconName: 'Volume2' },
      { id: 'c-mik', text: 'Mikrofon', category: 'giris', categoryLabel: 'Giriş Birimi (Input)', iconName: 'Mic' },
      { id: 'c-yaz', text: 'Yazıcı (Printer)', category: 'cikis', categoryLabel: 'Çıkış Birimi (Output)', iconName: 'Printer' }
    ]
  },

  // 7. Doğru / Yanlış 2
  {
    id: 'tf-2',
    type: 'dogru-yanlis',
    title: 'Dış Donanım ve Port Bağlantıları',
    category: 'dis',
    conceptKey: 'Monitör Ekran Kartı Bağlantı Kuralı',
    hint: 'Harici güçlü bir ekran kartı takılı olan bir kasada görüntü kablosunun nereye takılması gerektiğini hatırlayın.',
    explanation: 'Harici ekran kartı takılı sistemlerde monitör kablosu (HDMI/DisplayPort) mutlaka ekran kartının kendi arkasındaki portlara takılmalıdır; anakarttaki onboard porta takılırsa harici GPU devreye girmez veya görüntü gelmez.',
    statement: 'Harici ekran kartına sahip bir masaüstü bilgisayarda yüksek oyun ve grafik performansı alabilmek için monitör kablosu (HDMI/DP) mutlaka anakartın arkasına değil, ekran kartının kendi çıkış portuna takılmalıdır.',
    isTrue: true
  },

  // 8. Boşluk Doldurma 2
  {
    id: 'fill-2',
    type: 'bosluk-doldurma',
    title: 'Isı Yönetimi ve Termal İletkenlik',
    category: 'ic',
    conceptKey: 'Termal Macun ve Soğutma',
    hint: 'İşlemci ile soğutucu metal yüzey arasındaki mikroskobik hava boşluklarını dolduran gri renkli macundur.',
    explanation: 'Termal macun, işlemci yüzeyi ile soğutucu tabanı arasındaki mikroskobik pürüzleri doldurarak ısının metal soğutucuya kayıpsız iletilmesini sağlar.',
    sentenceBefore: 'İşlemci ile soğutucu blok arasındaki mikroskobik hava kabarcıklarını yok ederek ısının hızlıca soğutucuya iletilmesini sağlayan maddeye',
    sentenceAfter: 'adı verilir.',
    options: ['Termal Macun', 'Lehim Teli', 'Silikon Tutkal', 'Plastik Conta'],
    correctAnswer: 'Termal Macun'
  },

  // 9. Çoktan Seçmeli Soru 2
  {
    id: 'mc-2',
    type: 'coktan-secmeli',
    title: 'Yeni Nesil Fiziksel Arayüzler',
    category: 'dis',
    conceptKey: 'USB Type-C ve Portlar',
    hint: 'Ters takılma ihtimali olmayan, simetrik oval tasarımlı ve yüksek watt şarj taşıyabilen portu düşünün.',
    explanation: 'USB Type-C portu simetrik yapısı sayesinde iki yönlü takılabilir ve aynı anda hem 40 Gbps e varan yüksek hızlı veri, hem 240W a kadar güç/şarj, hem de 4K/8K görüntü sinyali taşıyabilir.',
    question: 'Hem ters hem düz takılabilen simetrik yapısıyla öne çıkan, tek bir kablo üzerinden hem yüksek hızlı veri aktarımı, hem şarj (güç iletimi), hem de monitör görüntü sinyali taşıyabilen yeni nesil evrensel port hangisidir?',
    options: [
      { id: 'opt-vga', text: 'VGA (Analog Görüntü Portu)' },
      { id: 'opt-usbc', text: 'USB Type-C' },
      { id: 'opt-ps2', text: 'PS/2 Klavye Portu' },
      { id: 'opt-sata', text: 'SATA Güç Konnektörü' }
    ],
    correctOptionId: 'opt-usbc'
  },

  // 10. Doğru / Yanlış 3
  {
    id: 'tf-3',
    type: 'dogru-yanlis',
    title: 'Çift Yönlü Donanım Birimleri',
    category: 'dis',
    conceptKey: 'Giriş ve Çıkış (G/Ç) Birimleri',
    hint: 'Dokunmatik ekrana parmağınızla bastığınızda komut gider, ekrana baktığınızda ise görüntü görürsünüz.',
    explanation: 'Dokunmatik ekran, parmak hareketlerini algılayarak giriş (input) alırken aynı anda görüntüyü kullanıcıya yansıtarak çıkış (output) verdiği için hem giriş hem çıkış birimidir.',
    statement: 'Dokunmatik ekranlar (Touchscreen), kullanıcıdan parmak dokunuşuyla komut alırken aynı zamanda kullanıcıya görüntü yansıttığı için "Hem Giriş Hem Çıkış Birimi" sınıfına girer.',
    isTrue: true
  }
];
